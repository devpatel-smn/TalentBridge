<?php

namespace App\Modules\JobSeeker\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\JobSeekerProfile;
use App\Models\User;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerProfileRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    public function __construct(
        private readonly JobSeekerProfileRepositoryInterface $profiles,
        private readonly ProfileCompletionService $completion,
    ) {}

    public function getProfile(User $user): JobSeekerProfile
    {
        return $this->profiles->findByUserId($user->id)
            ?? throw ValidationException::withMessages(['profile' => ['Job seeker profile not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(JobSeekerProfile $profile, array $data, User $actor, Request $request): JobSeekerProfile
    {
        return DB::transaction(function () use ($profile, $data, $actor, $request) {
            $oldValues = $profile->only([
                'headline', 'summary', 'current_title', 'years_of_experience',
                'linkedin_url', 'portfolio_url', 'is_open_to_work', 'is_profile_public',
                'location_city', 'location_state', 'location_country', 'resume_file_id',
            ]);

            $userUpdates = [];
            foreach (['first_name', 'last_name', 'phone'] as $field) {
                if (array_key_exists($field, $data)) {
                    $userUpdates[$field] = $data[$field];
                }
            }

            if ($userUpdates !== []) {
                $actor->update($userUpdates);
            }

            $profileUpdates = [];
            foreach ([
                'headline', 'summary', 'current_title', 'years_of_experience',
                'linkedin_url', 'portfolio_url', 'is_open_to_work', 'is_profile_public',
                'location_city', 'location_state', 'location_country', 'resume_file_id',
            ] as $field) {
                if (array_key_exists($field, $data)) {
                    $profileUpdates[$field] = $data[$field];
                }
            }

            if ($profileUpdates !== []) {
                $profile = $this->profiles->update($profile, $profileUpdates);
            }

            $profile = $this->recalculateCompletion($profile->fresh(['user']), $actor);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => JobSeekerProfile::class,
                'auditable_id' => $profile->id,
                'old_values' => $oldValues,
                'new_values' => $profileUpdates,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $profile->load(['user', 'resumeFile', 'skills']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updatePreferences(JobSeekerProfile $profile, array $data, User $actor, Request $request): JobSeekerProfile
    {
        return DB::transaction(function () use ($profile, $data, $actor, $request) {
            $oldValues = $profile->only([
                'expected_salary_min', 'expected_salary_max', 'salary_currency',
                'preferred_work_mode', 'preferred_employment_type', 'willing_to_relocate',
            ]);

            $updates = [];
            foreach ([
                'expected_salary_min', 'expected_salary_max', 'salary_currency',
                'preferred_work_mode', 'preferred_employment_type', 'willing_to_relocate',
            ] as $field) {
                if (array_key_exists($field, $data)) {
                    $updates[$field] = $data[$field];
                }
            }

            $profile = $this->profiles->update($profile, $updates);
            $profile = $this->recalculateCompletion($profile->fresh(['user']), $actor);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => JobSeekerProfile::class,
                'auditable_id' => $profile->id,
                'old_values' => $oldValues,
                'new_values' => $updates,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $profile;
        });
    }

    /**
     * @return array{percentage: int, breakdown: array<string, array{weight: int, completed: bool, score: int}>}
     */
    public function getCompletion(JobSeekerProfile $profile, User $user): array
    {
        return $this->completion->calculate($profile->load('user'), $user);
    }

    public function recalculateCompletion(JobSeekerProfile $profile, User $user): JobSeekerProfile
    {
        $result = $this->completion->calculate($profile, $user);

        if ($profile->profile_completion !== $result['percentage']) {
            return $this->profiles->update($profile, [
                'profile_completion' => $result['percentage'],
            ]);
        }

        return $profile;
    }
}
