<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\Interview;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminInterviewRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findByUuid(string $uuid): ?Interview;
}
