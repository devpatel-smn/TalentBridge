<?php

namespace App\Modules\Application\Repositories\Contracts;

use App\Models\ApplicationStatusHistory;
use App\Models\Job;
use App\Models\JobApplication;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface JobApplicationRepositoryInterface
{
    public function paginateForJobSeeker(int $profileId, ListQueryParams $params): LengthAwarePaginator;

    public function paginateForCompany(int $companyId, ListQueryParams $params, ?string $jobUuid = null): LengthAwarePaginator;

    public function findForJobSeeker(string $uuid, int $profileId): ?JobApplication;

    public function findForCompany(string $uuid, int $companyId): ?JobApplication;

    public function existsForJobAndProfile(int $jobId, int $profileId): bool;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): JobApplication;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(JobApplication $application, array $attributes): JobApplication;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function createStatusHistory(array $attributes): ApplicationStatusHistory;

    public function lockJobForUpdate(int $jobId): Job;

    /**
     * @return array<string, mixed>
     */
    public function analyticsForJob(int $companyId, string $jobUuid): array;
}
