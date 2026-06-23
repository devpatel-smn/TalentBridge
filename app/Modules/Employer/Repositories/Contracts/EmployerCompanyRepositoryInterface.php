<?php

namespace App\Modules\Employer\Repositories\Contracts;

use App\Models\Company;

interface EmployerCompanyRepositoryInterface
{
    public function findById(int $id): ?Company;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Company $company, array $attributes): Company;
}
