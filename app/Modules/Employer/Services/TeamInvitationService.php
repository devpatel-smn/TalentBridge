<?php

namespace App\Modules\Employer\Services;

use App\Enums\UserStatus;
use App\Models\Company;
use App\Models\EmployerTeamInvitation;
use App\Models\EmployerUser;
use App\Models\User;
use App\Modules\Auth\Services\AuthService;
use App\Notifications\TeamInvitationNotification;
use App\Notifications\TeamMemberAddedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TeamInvitationService
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function preview(string $email, string $token): array
    {
        $invitation = $this->findValidInvitation($email, $token);
        $invitation->loadMissing(['company', 'inviter']);

        return [
            'email' => $invitation->email,
            'job_title' => $invitation->job_title,
            'company' => [
                'name' => $invitation->company->name,
            ],
            'invited_by' => [
                'full_name' => $invitation->inviter->full_name,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function accept(array $data, Request $request): User
    {
        $invitation = $this->findValidInvitation($data['email'], $data['token']);
        $invitation->loadMissing(['employerUser', 'user', 'company']);

        return DB::transaction(function () use ($invitation, $data, $request) {
            $user = $invitation->user;

            $user->forceFill([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'password' => $data['password'],
                'email_verified_at' => now(),
                'status' => UserStatus::Active,
            ])->save();

            $invitation->employerUser->update([
                'is_active' => true,
                'joined_at' => now(),
            ]);

            $invitation->update([
                'accepted_at' => now(),
            ]);

            return $this->authService->loginRegisteredUser(
                $user->fresh(['roles.permissions', 'jobSeekerProfile', 'employerUsers.company']),
                $request
            );
        });
    }

    public function findValidInvitation(string $email, string $plainToken): EmployerTeamInvitation
    {
        $normalizedEmail = strtolower($email);

        $invitations = EmployerTeamInvitation::query()
            ->whereRaw('LOWER(email) = ?', [$normalizedEmail])
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->get();

        foreach ($invitations as $invitation) {
            if (Hash::check($plainToken, $invitation->token)) {
                return $invitation;
            }
        }

        throw ValidationException::withMessages([
            'token' => ['This invitation link is invalid or has expired.'],
        ]);
    }

    public function hasPendingInvitation(string $email, int $companyId): bool
    {
        return EmployerTeamInvitation::query()
            ->whereRaw('LOWER(email) = ?', [strtolower($email)])
            ->where('company_id', $companyId)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->exists();
    }

    public function sendInvitationEmail(
        string $email,
        Company $company,
        User $inviter,
        string $plainToken,
        ?string $jobTitle,
    ): void {
        Notification::route('mail', strtolower($email))
            ->notify(new TeamInvitationNotification($company, $inviter, $plainToken, strtolower($email), $jobTitle));
    }

    public function sendAddedNotification(
        User $user,
        Company $company,
        User $inviter,
        ?string $jobTitle,
    ): void {
        $user->notify(new TeamMemberAddedNotification($company, $inviter, $jobTitle));
    }

    /**
     * @return array{invitation: EmployerTeamInvitation, plain_token: string}
     */
    public function createInvitationRecord(
        string $email,
        int $companyId,
        EmployerUser $member,
        User $user,
        User $inviter,
        ?string $jobTitle,
        bool $isPrimary,
    ): array {
        $plainToken = Str::random(64);
        $expireHours = (int) config('talentbridge.team_invitation.expire_hours', 72);

        $invitation = EmployerTeamInvitation::query()->create([
            'email' => strtolower($email),
            'company_id' => $companyId,
            'employer_user_id' => $member->id,
            'user_id' => $user->id,
            'job_title' => $jobTitle,
            'is_primary' => $isPrimary,
            'invited_by' => $inviter->id,
            'token' => Hash::make($plainToken),
            'expires_at' => now()->addHours($expireHours),
        ]);

        return [
            'invitation' => $invitation,
            'plain_token' => $plainToken,
        ];
    }

    public function cancelPendingInvitation(EmployerUser $member): void
    {
        EmployerTeamInvitation::query()
            ->where('employer_user_id', $member->id)
            ->whereNull('accepted_at')
            ->delete();
    }
}
