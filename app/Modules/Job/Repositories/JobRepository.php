<?php

namespace App\Modules\Job\Repositories;

use App\Models\Job;
use App\Modules\Job\Repositories\Contracts\JobRepositoryInterface;
use App\Modules\Job\Support\AppliesJobFilters;
use App\Modules\Job\Support\JobListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class JobRepository implements JobRepositoryInterface
{
    use AppliesJobFilters;

    private const PUBLIC_SORTABLE = [
        'published_at', 'created_at', 'title', 'salary_min', 'salary_max', 'views_count',
    ];

    private const EMPLOYER_SORTABLE = [
        'created_at', 'published_at', 'title', 'status', 'views_count', 'applications_count',
    ];

    public function paginatePublic(JobListQueryParams $params): LengthAwarePaginator
    {
        $query = Job::query()
            ->active()
            ->with(['company.logo', 'category', 'skills']);

        $this->applyJobFilters($query, $params, self::PUBLIC_SORTABLE, 'published_at');

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function featured(int $limit = 10): Collection
    {
        return Job::query()
            ->active()
            ->where('is_featured', true)
            ->with(['company.logo', 'category', 'skills'])
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();
    }

    public function paginateForCompany(int $companyId, JobListQueryParams $params): LengthAwarePaginator
    {
        $query = Job::query()
            ->where('company_id', $companyId)
            ->with(['category', 'skills', 'creator']);

        if (in_array('company', $params->includes, true)) {
            $query->with('company');
        }

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('title', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search)
                    ->orWhere('location_city', 'ilike', $search);
            });
        }

        $this->applyJobFilters($query, $params, self::EMPLOYER_SORTABLE, 'created_at');

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findByUuid(string $uuid, ?int $companyId = null): ?Job
    {
        $query = Job::query()
            ->with(['company.logo', 'category', 'skills', 'creator', 'updater'])
            ->where('uuid', $uuid);

        if ($companyId !== null) {
            $query->where('company_id', $companyId);
        }

        return $query->first();
    }

    public function create(array $attributes): Job
    {
        $job = Job::query()->create($attributes);

        return $job->fresh(['company', 'category', 'skills', 'creator']);
    }

    public function update(Job $job, array $attributes): Job
    {
        $job->update($attributes);

        return $job->fresh(['company', 'category', 'skills', 'creator', 'updater']);
    }

    public function delete(Job $job): bool
    {
        return (bool) $job->delete();
    }

    public function syncSkills(Job $job, array $skills): void
    {
        $syncData = [];

        foreach ($skills as $skill) {
            $syncData[$skill['skill_id']] = ['is_required' => $skill['is_required']];
        }

        $job->skills()->sync($syncData);
        $job->unsetRelation('skills');
    }

    public function incrementViews(Job $job): void
    {
        $job->increment('views_count');
    }
}
