<?php

namespace App\Modules\Admin\Repositories;

use App\Models\AuditLog;
use App\Modules\Admin\Repositories\Contracts\AdminAuditLogRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminAuditLogRepository implements AdminAuditLogRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = AuditLog::query()->with(['user']);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('auditable_type', 'ilike', $search)
                    ->orWhere('action', 'ilike', $search);
            });
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'action', 'created_at'],
            'created_at',
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findById(int $id): ?AuditLog
    {
        return AuditLog::query()
            ->with(['user', 'auditable'])
            ->find($id);
    }
}
