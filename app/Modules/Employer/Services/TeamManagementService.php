<?php

namespace App\Modules\Employer\Services;

use App\Enums\AuditAction;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\EmployerTeamInvitation;
use App\Models\EmployerUser;
use App\Models\Role;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Employer\Repositories\Contracts\EmployerTeamRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TeamManagementService
{
    public function __construct(
        private readonly EmployerTeamRepositoryInterface $team,
        private readonly UserRepositoryInterface $users,
        private readonly TeamInvitationService $invitations,
    ) {}

    public function list(int $companyId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->team->paginateByCompany($companyId, $params);
    }

    public function find(int $companyId, int $memberId): EmployerUser
    {
        return $this->team->findByIdForCompany($memberId, $companyId)
            ?? throw ValidationException::withMessages(['id' => ['Team member not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function invite(int $companyId, array $data, User $inviter, Request $request): EmployerUser
    {
        $email = strtolower($data['email']);
        $user = $this->users->findByEmail($email);

        if ($this->invitations->hasPendingInvitation($email, $companyId)) {
            throw ValidationException::withMessages([
                'email' => ['A pending invitation already exists for this email address.'],
            ]);
        }

        if ($user) {
            $existingMembership = $this->team->findByUserAndCompany($user->id, $companyId);

            if ($existingMembership?->is_active) {
                throw ValidationException::withMessages([
                    'email' => ['This user is already a member of the company.'],
                ]);
            }

            if ($existingMembership) {
                return $this->reactivatePendingMembership($existingMembership, $data, $inviter, $request);
            }

            return $this->inviteExistingUser($companyId, $data, $inviter, $request, $user);
        }

        return $this->inviteNewUser($companyId, $data, $inviter, $request);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(EmployerUser $member, array $data, User $actor, Request $request): EmployerUser
    {
        return DB::transaction(function () use ($member, $data, $actor, $request) {
            $updates = [];

            if (array_key_exists('job_title', $data)) {
                $updates['job_title'] = $data['job_title'];
            }

            if (array_key_exists('is_active', $data)) {
                if ($data['is_active'] === false && $member->user_id === $actor->id) {
                    throw ValidationException::withMessages([
                        'is_active' => ['You cannot deactivate your own membership.'],
                    ]);
                }

                if ($data['is_active'] === false && $member->is_primary && $this->team->countActiveByCompany($member->company_id) <= 1) {
                    throw ValidationException::withMessages([
                        'is_active' => ['Cannot deactivate the only active team member.'],
                    ]);
                }

                $updates['is_active'] = $data['is_active'];
            }

            if (array_key_exists('is_primary', $data) && $data['is_primary'] === true) {
                $this->team->clearPrimaryForCompany($member->company_id);
                $updates['is_primary'] = true;
            } elseif (array_key_exists('is_primary', $data) && $data['is_primary'] === false) {
                if ($member->is_primary && $this->team->countActiveByCompany($member->company_id) <= 1) {
                    throw ValidationException::withMessages([
                        'is_primary' => ['The company must have a primary contact.'],
                    ]);
                }

                $updates['is_primary'] = false;
            }

            $member = $this->team->update($member, $updates);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => EmployerUser::class,
                'auditable_id' => $member->id,
                'new_values' => $updates,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $member;
        });
    }

    public function remove(EmployerUser $member, User $actor, Request $request): void
    {
        if ($member->user_id === $actor->id) {
            throw ValidationException::withMessages([
                'member' => ['You cannot remove yourself from the team.'],
            ]);
        }

        if ($member->is_active && $member->is_primary && $this->team->countActiveByCompany($member->company_id) <= 1) {
            throw ValidationException::withMessages([
                'member' => ['Cannot remove the only active team member.'],
            ]);
        }

        DB::transaction(function () use ($member, $actor, $request): void {
            $this->invitations->cancelPendingInvitation($member);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => EmployerUser::class,
                'auditable_id' => $member->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $userId = $member->user_id;
            $isPendingInvite = ! $member->is_active && $member->joined_at === null;

            $this->team->delete($member);

            if ($isPendingInvite) {
                $user = User::query()->find($userId);

                if ($user && $user->last_login_at === null && $user->employerUsers()->count() === 0) {
                    EmployerTeamInvitation::query()->where('user_id', $user->id)->delete();
                    $user->delete();
                }
            }
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function inviteExistingUser(
        int $companyId,
        array $data,
        User $inviter,
        Request $request,
        User $user,
    ): EmployerUser {
        return DB::transaction(function () use ($companyId, $data, $inviter, $request, $user) {
            if (! $user->hasRole(Role::EMPLOYER)) {
                $user->assignRole(Role::EMPLOYER);
            }

            $isPrimary = (bool) ($data['is_primary'] ?? false);

            if ($isPrimary) {
                $this->team->clearPrimaryForCompany($companyId);
            }

            $member = $this->team->create([
                'user_id' => $user->id,
                'company_id' => $companyId,
                'job_title' => $data['job_title'] ?? null,
                'is_primary' => $isPrimary,
                'is_active' => true,
                'invited_by' => $inviter->id,
                'joined_at' => now(),
            ]);

            $company = Company::query()->findOrFail($companyId);
            $this->invitations->sendAddedNotification(
                $user,
                $company,
                $inviter,
                $data['job_title'] ?? null,
            );

            $this->logInviteAudit($inviter, $member, $companyId, $user->id, $request);

            return $member;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function inviteNewUser(
        int $companyId,
        array $data,
        User $inviter,
        Request $request,
    ): EmployerUser {
        return DB::transaction(function () use ($companyId, $data, $inviter, $request) {
            $email = strtolower($data['email']);
            [$firstName, $lastName] = $this->derivePlaceholderName($email);

            $user = $this->users->create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => Str::password(32),
                'status' => UserStatus::PendingVerification,
            ]);

            $user->assignRole(Role::EMPLOYER);

            $isPrimary = (bool) ($data['is_primary'] ?? false);

            if ($isPrimary) {
                $this->team->clearPrimaryForCompany($companyId);
            }

            $member = $this->team->create([
                'user_id' => $user->id,
                'company_id' => $companyId,
                'job_title' => $data['job_title'] ?? null,
                'is_primary' => $isPrimary,
                'is_active' => false,
                'invited_by' => $inviter->id,
                'joined_at' => null,
            ]);

            ['plain_token' => $plainToken] = $this->invitations->createInvitationRecord(
                $email,
                $companyId,
                $member,
                $user,
                $inviter,
                $data['job_title'] ?? null,
                $isPrimary,
            );

            $company = Company::query()->findOrFail($companyId);
            $this->invitations->sendInvitationEmail(
                $email,
                $company,
                $inviter,
                $plainToken,
                $data['job_title'] ?? null,
            );

            $this->logInviteAudit($inviter, $member, $companyId, $user->id, $request);

            return $member;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function reactivatePendingMembership(
        EmployerUser $member,
        array $data,
        User $inviter,
        Request $request,
    ): EmployerUser {
        throw ValidationException::withMessages([
            'email' => ['This user already has a pending invitation for this company.'],
        ]);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function derivePlaceholderName(string $email): array
    {
        $localPart = Str::before($email, '@');
        $normalized = Str::of($localPart)
            ->replace(['.', '_', '-'], ' ')
            ->squish()
            ->title()
            ->toString();

        if ($normalized === '') {
            return ['Invited', 'Member'];
        }

        $parts = explode(' ', $normalized, 2);

        return [
            $parts[0],
            $parts[1] ?? 'Member',
        ];
    }

    private function logInviteAudit(
        User $inviter,
        EmployerUser $member,
        int $companyId,
        int $userId,
        Request $request,
    ): void {
        AuditLog::query()->create([
            'user_id' => $inviter->id,
            'action' => AuditAction::Created,
            'auditable_type' => EmployerUser::class,
            'auditable_id' => $member->id,
            'new_values' => [
                'company_id' => $companyId,
                'user_id' => $userId,
                'invite_pending' => ! $member->is_active && $member->joined_at === null,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }
}
