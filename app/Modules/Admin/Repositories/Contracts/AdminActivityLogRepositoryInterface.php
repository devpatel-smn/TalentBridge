<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\ActivityLog;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminActivityLogRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findById(int $id): ?ActivityLog;
}
