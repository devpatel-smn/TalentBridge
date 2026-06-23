<?php

namespace App\Modules\Job\Repositories\Contracts;

use App\Models\Job;
use App\Modules\Job\Support\JobListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface JobRepositoryInterface
{
    public function paginatePublic(JobListQueryParams $params): LengthAwarePaginator;

    /**
     * @return Collection<int, Job>
     */
    public function featured(int $limit = 10): Collection;

    public function paginateForCompany(int $companyId, JobListQueryParams $params): LengthAwarePaginator;

    public function findByUuid(string $uuid, ?int $companyId = null): ?Job;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Job;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Job $job, array $attributes): Job;

    public function delete(Job $job): bool;

    /**
     * @param  list<array{skill_id: int, is_required: bool}>  $skills
     */
    public function syncSkills(Job $job, array $skills): void;

    public function incrementViews(Job $job): void;
}
