<?php

namespace App\Modules\Admin\Services;

use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Modules\Admin\Repositories\Contracts\AdminActivityLogRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminAuditLogRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class LogManagementService
{
    public function __construct(
        private readonly AdminActivityLogRepositoryInterface $activityLogs,
        private readonly AdminAuditLogRepositoryInterface $auditLogs,
    ) {}

    public function listActivityLogs(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->activityLogs->paginate($params);
    }

    public function findActivityLog(int $id): ActivityLog
    {
        return $this->activityLogs->findById($id)
            ?? throw ValidationException::withMessages(['id' => ['Activity log not found.']]);
    }

    public function listAuditLogs(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->auditLogs->paginate($params);
    }

    public function findAuditLog(int $id): AuditLog
    {
        return $this->auditLogs->findById($id)
            ?? throw ValidationException::withMessages(['id' => ['Audit log not found.']]);
    }
}
