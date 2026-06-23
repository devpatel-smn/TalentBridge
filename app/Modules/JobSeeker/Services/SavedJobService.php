<?php

namespace App\Modules\JobSeeker\Services;

use App\Enums\AuditAction;
use App\Enums\JobStatus;
use App\Models\AuditLog;
use App\Models\Job;
use App\Models\JobSeekerProfile;
use App\Models\SavedJob;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\SavedJobRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SavedJobService
{
    public function __construct(
        private readonly SavedJobRepositoryInterface $savedJobs,
    ) {}

    public function list(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->savedJobs->listForProfile($profileId, $params);
    }

    public function find(int $profileId, int $savedJobId): SavedJob
    {
        return $this->savedJobs->findForProfile($profileId, $savedJobId)
            ?? throw ValidationException::withMessages(['saved_job' => ['Saved job not found.']]);
    }

    public function findByJobUuid(int $profileId, string $jobUuid): ?SavedJob
    {
        return $this->savedJobs->findByJobUuid($profileId, $jobUuid);
    }

    public function save(JobSeekerProfile $profile, string $jobUuid, User $actor, Request $request): SavedJob
    {
        $job = Job::query()
            ->where('uuid', $jobUuid)
            ->where('status', JobStatus::Published)
            ->whereNull('deleted_at')
            ->first();

        if (! $job) {
            throw ValidationException::withMessages([
                'job_uuid' => ['Published job not found.'],
            ]);
        }

        if ($this->savedJobs->exists($profile->id, $job->id)) {
            throw ValidationException::withMessages([
                'job_uuid' => ['Job is already saved.'],
            ]);
        }

        return DB::transaction(function () use ($profile, $job, $actor, $request) {
            $savedJob = $this->savedJobs->create($profile->id, $job->id);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Created,
                'auditable_type' => SavedJob::class,
                'auditable_id' => $savedJob->id,
                'new_values' => ['job_id' => $job->id, 'job_uuid' => $job->uuid],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $savedJob;
        });
    }

    public function unsave(JobSeekerProfile $profile, string $jobUuid, User $actor, Request $request): void
    {
        $savedJob = $this->savedJobs->findByJobUuid($profile->id, $jobUuid)
            ?? throw ValidationException::withMessages(['job_uuid' => ['Saved job not found.']]);

        DB::transaction(function () use ($savedJob, $actor, $request) {
            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => SavedJob::class,
                'auditable_id' => $savedJob->id,
                'old_values' => $savedJob->toArray(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->savedJobs->delete($savedJob);
        });
    }
}
