<?php

namespace App\Modules\Admin\Repositories;

use App\Models\Job;
use App\Modules\Admin\Repositories\Contracts\AdminJobRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminJobRepository implements AdminJobRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = Job::query()->with(['company', 'category', 'creator']);

        if (in_array('skills', $params->includes, true)) {
            $query->with('skills');
        }

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('title', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search)
                    ->orWhere('location_city', 'ilike', $search);
            });
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'title', 'status', 'published_at', 'created_at', 'applications_count', 'views_count'],
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findByUuid(string $uuid): ?Job
    {
        return Job::query()
            ->with(['company', 'category', 'creator', 'updater', 'skills', 'applications'])
            ->where('uuid', $uuid)
            ->first();
    }

    public function update(Job $job, array $attributes): Job
    {
        $job->update($attributes);

        return $job->fresh(['company', 'category', 'creator', 'skills']);
    }

    public function delete(Job $job): bool
    {
        return (bool) $job->delete();
    }
}
