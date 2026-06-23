<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\AuditLog;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminAuditLogRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findById(int $id): ?AuditLog;
}
