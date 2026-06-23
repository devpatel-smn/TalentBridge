<?php

namespace App\Modules\Job\Services;

use App\Models\Job;
use App\Modules\Job\Repositories\Contracts\JobRepositoryInterface;
use App\Modules\Job\Support\JobListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class JobSearchService
{
    public function __construct(
        private readonly JobRepositoryInterface $jobs,
    ) {}

    public function searchPublic(JobListQueryParams $params): LengthAwarePaginator
    {
        return $this->jobs->paginatePublic($params);
    }

    /**
     * @return Collection<int, Job>
     */
    public function featured(int $limit = 10): Collection
    {
        return $this->jobs->featured($limit);
    }
}
