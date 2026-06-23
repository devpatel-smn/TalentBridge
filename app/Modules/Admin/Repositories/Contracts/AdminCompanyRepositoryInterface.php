<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\Company;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminCompanyRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findByUuid(string $uuid): ?Company;

    public function update(Company $company, array $attributes): Company;

    public function delete(Company $company): bool;
}
