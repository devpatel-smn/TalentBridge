<?php

namespace App\Modules\JobSeeker\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\Education;
use App\Models\JobSeekerProfile;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\EducationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EducationService
{
    public function __construct(
        private readonly EducationRepositoryInterface $educations,
        private readonly ProfileService $profileService,
    ) {}

    public function list(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->educations->listForProfile($profileId, $params);
    }

    public function find(int $profileId, int $educationId): Education
    {
        return $this->educations->findForProfile($profileId, $educationId)
            ?? throw ValidationException::withMessages(['education' => ['Education not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(JobSeekerProfile $profile, array $data, User $actor, Request $request): Education
    {
        return DB::transaction(function () use ($profile, $data, $actor, $request) {
            if (($data['is_current'] ?? false) === true) {
                Education::query()
                    ->where('job_seeker_profile_id', $profile->id)
                    ->update(['is_current' => false, 'ended_at' => null]);
            }

            $education = $this->educations->create($profile->id, $this->mapAttributes($data));

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Created,
                'auditable_type' => Education::class,
                'auditable_id' => $education->id,
                'new_values' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->profileService->recalculateCompletion($profile, $actor);

            return $education;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Education $education, array $data, User $actor, Request $request): Education
    {
        return DB::transaction(function () use ($education, $data, $actor, $request) {
            $oldValues = $education->only([
                'institution', 'degree', 'field_of_study', 'grade',
                'description', 'started_at', 'ended_at', 'is_current', 'sort_order',
            ]);

            if (($data['is_current'] ?? false) === true) {
                Education::query()
                    ->where('job_seeker_profile_id', $education->job_seeker_profile_id)
                    ->where('id', '!=', $education->id)
                    ->update(['is_current' => false]);
            }

            $education = $this->educations->update($education, $this->mapAttributes($data));

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Education::class,
                'auditable_id' => $education->id,
                'old_values' => $oldValues,
                'new_values' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $profile = $education->jobSeekerProfile;
            if ($profile) {
                $this->profileService->recalculateCompletion($profile, $actor);
            }

            return $education;
        });
    }

    public function delete(Education $education, User $actor, Request $request): void
    {
        DB::transaction(function () use ($education, $actor, $request) {
            $profile = $education->jobSeekerProfile;

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => Education::class,
                'auditable_id' => $education->id,
                'old_values' => $education->toArray(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->educations->delete($education);

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
            'institution', 'degree', 'field_of_study', 'grade',
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
