<?php

namespace App\Modules\JobSeeker\Repositories\Contracts;

use App\Models\SavedJob;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SavedJobRepositoryInterface
{
    public function findForProfile(int $profileId, int $savedJobId): ?SavedJob;

    public function findByJobUuid(int $profileId, string $jobUuid): ?SavedJob;

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator;

    public function create(int $profileId, int $jobId): SavedJob;

    public function delete(SavedJob $savedJob): void;

    public function exists(int $profileId, int $jobId): bool;
}
