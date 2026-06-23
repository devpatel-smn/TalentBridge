<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\EmployerUser;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminEmployerRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findById(int $id): ?EmployerUser;
}
