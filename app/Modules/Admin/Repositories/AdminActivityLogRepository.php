<?php

namespace App\Modules\Admin\Repositories;

use App\Models\ActivityLog;
use App\Modules\Admin\Repositories\Contracts\AdminActivityLogRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminActivityLogRepository implements AdminActivityLogRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = ActivityLog::query()->with(['user', 'company']);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('activity_type', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search);
            });
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'activity_type', 'created_at'],
            'created_at',
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findById(int $id): ?ActivityLog
    {
        return ActivityLog::query()
            ->with(['user', 'company', 'subject'])
            ->find($id);
    }
}
