<?php

namespace App\Modules\Employer\Repositories\Contracts;

use App\Models\EmployerUser;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmployerTeamRepositoryInterface
{
    public function paginateByCompany(int $companyId, ListQueryParams $params): LengthAwarePaginator;

    public function findByIdForCompany(int $id, int $companyId): ?EmployerUser;

    public function findByUserAndCompany(int $userId, int $companyId): ?EmployerUser;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): EmployerUser;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(EmployerUser $member, array $attributes): EmployerUser;

    public function delete(EmployerUser $member): bool;

    public function countActiveByCompany(int $companyId): int;

    public function clearPrimaryForCompany(int $companyId): void;
}
