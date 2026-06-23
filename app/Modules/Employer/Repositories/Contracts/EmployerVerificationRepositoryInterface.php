<?php

namespace App\Modules\Employer\Repositories\Contracts;

use App\Models\CompanyVerification;

interface EmployerVerificationRepositoryInterface
{
    public function findLatestByCompanyId(int $companyId): ?CompanyVerification;

    public function hasPendingVerification(int $companyId): bool;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): CompanyVerification;
}
