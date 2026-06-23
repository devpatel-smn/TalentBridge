<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\CompanyVerification;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminVerificationRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findById(int $id): ?CompanyVerification;

    public function update(CompanyVerification $verification, array $attributes): CompanyVerification;
}
