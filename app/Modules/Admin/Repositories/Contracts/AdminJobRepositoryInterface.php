<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\Job;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminJobRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findByUuid(string $uuid): ?Job;

    public function update(Job $job, array $attributes): Job;

    public function delete(Job $job): bool;
}
