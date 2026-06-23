<?php

namespace App\Modules\Employer\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\EmployerUser;
use App\Models\Role;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Employer\Repositories\Contracts\EmployerTeamRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TeamManagementService
{
    public function __construct(
        private readonly EmployerTeamRepositoryInterface $team,
        private readonly UserRepositoryInterface $users,
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
        $user = $this->users->findByEmail($data['email']);

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['No user found with this email address. The user must register first.'],
            ]);
        }

        if ($this->team->findByUserAndCompany($user->id, $companyId)) {
            throw ValidationException::withMessages([
                'email' => ['This user is already a member of the company.'],
            ]);
        }

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

            AuditLog::query()->create([
                'user_id' => $inviter->id,
                'action' => AuditAction::Created,
                'auditable_type' => EmployerUser::class,
                'auditable_id' => $member->id,
                'new_values' => [
                    'company_id' => $companyId,
                    'user_id' => $user->id,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $member;
        });
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

        if ($member->is_primary && $this->team->countActiveByCompany($member->company_id) <= 1) {
            throw ValidationException::withMessages([
                'member' => ['Cannot remove the only active team member.'],
            ]);
        }

        DB::transaction(function () use ($member, $actor, $request): void {
            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => EmployerUser::class,
                'auditable_id' => $member->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->team->delete($member);
        });
    }
}
