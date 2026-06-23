<?php

namespace App\Modules\JobSeeker\Repositories;

use App\Enums\JobStatus;
use App\Models\SavedJob;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\SavedJobRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SavedJobRepository implements SavedJobRepositoryInterface
{
    public function findForProfile(int $profileId, int $savedJobId): ?SavedJob
    {
        return SavedJob::query()
            ->with(['job.company', 'job.category'])
            ->where('job_seeker_profile_id', $profileId)
            ->find($savedJobId);
    }

    public function findByJobUuid(int $profileId, string $jobUuid): ?SavedJob
    {
        return SavedJob::query()
            ->with(['job.company', 'job.category'])
            ->where('job_seeker_profile_id', $profileId)
            ->whereHas('job', fn ($query) => $query->where('uuid', $jobUuid))
            ->first();
    }

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        $query = SavedJob::query()
            ->with(['job.company', 'job.category'])
            ->where('job_seeker_profile_id', $profileId)
            ->whereHas('job', fn ($builder) => $builder
                ->where('status', JobStatus::Published)
                ->whereNull('deleted_at'));

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->whereHas('job', fn ($builder) => $builder->where('title', 'ilike', $search));
        }

        return $query
            ->orderBy('created_at', $params->order)
            ->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function create(int $profileId, int $jobId): SavedJob
    {
        return SavedJob::query()->create([
            'job_seeker_profile_id' => $profileId,
            'job_id' => $jobId,
        ])->load(['job.company', 'job.category']);
    }

    public function delete(SavedJob $savedJob): void
    {
        $savedJob->delete();
    }

    public function exists(int $profileId, int $jobId): bool
    {
        return SavedJob::query()
            ->where('job_seeker_profile_id', $profileId)
            ->where('job_id', $jobId)
            ->exists();
    }
}
