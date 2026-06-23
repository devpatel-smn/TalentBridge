<?php

namespace App\Modules\JobSeeker\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\Experience;
use App\Models\JobSeekerProfile;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\ExperienceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ExperienceService
{
    public function __construct(
        private readonly ExperienceRepositoryInterface $experiences,
        private readonly ProfileService $profileService,
    ) {}

    public function list(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->experiences->listForProfile($profileId, $params);
    }

    public function find(int $profileId, int $experienceId): Experience
    {
        return $this->experiences->findForProfile($profileId, $experienceId)
            ?? throw ValidationException::withMessages(['experience' => ['Experience not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(JobSeekerProfile $profile, array $data, User $actor, Request $request): Experience
    {
        return DB::transaction(function () use ($profile, $data, $actor, $request) {
            if (($data['is_current'] ?? false) === true) {
                Experience::query()
                    ->where('job_seeker_profile_id', $profile->id)
                    ->update(['is_current' => false, 'ended_at' => null]);
            }

            $experience = $this->experiences->create($profile->id, $this->mapAttributes($data));

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Created,
                'auditable_type' => Experience::class,
                'auditable_id' => $experience->id,
                'new_values' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->profileService->recalculateCompletion($profile, $actor);

            return $experience;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Experience $experience, array $data, User $actor, Request $request): Experience
    {
        return DB::transaction(function () use ($experience, $data, $actor, $request) {
            $oldValues = $experience->only([
                'company_name', 'job_title', 'employment_type', 'location',
                'description', 'started_at', 'ended_at', 'is_current', 'sort_order',
            ]);

            if (($data['is_current'] ?? false) === true) {
                Experience::query()
                    ->where('job_seeker_profile_id', $experience->job_seeker_profile_id)
                    ->where('id', '!=', $experience->id)
                    ->update(['is_current' => false]);
            }

            $experience = $this->experiences->update($experience, $this->mapAttributes($data));

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Experience::class,
                'auditable_id' => $experience->id,
                'old_values' => $oldValues,
                'new_values' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $profile = $experience->jobSeekerProfile;
            if ($profile) {
                $this->profileService->recalculateCompletion($profile, $actor);
            }

            return $experience;
        });
    }

    public function delete(Experience $experience, User $actor, Request $request): void
    {
        DB::transaction(function () use ($experience, $actor, $request) {
            $profile = $experience->jobSeekerProfile;

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => Experience::class,
                'auditable_id' => $experience->id,
                'old_values' => $experience->toArray(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->experiences->delete($experience);

            if ($profile) {
                $this->profileService->recalculateCompletion($profile, $actor);
            }
        });
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function mapAttributes(array $data): array
    {
        $attributes = [];

        foreach ([
            'company_name', 'job_title', 'employment_type', 'location',
            'description', 'started_at', 'ended_at', 'is_current', 'sort_order',
        ] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $data[$field];
            }
        }

        if (($attributes['is_current'] ?? false) === true) {
            $attributes['ended_at'] = null;
        }

        return $attributes;
    }
}
