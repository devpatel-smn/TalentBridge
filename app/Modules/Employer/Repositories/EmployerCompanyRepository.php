<?php

namespace App\Modules\Employer\Repositories;

use App\Models\Company;
use App\Modules\Employer\Repositories\Contracts\EmployerCompanyRepositoryInterface;

class EmployerCompanyRepository implements EmployerCompanyRepositoryInterface
{
    public function findById(int $id): ?Company
    {
        return Company::query()
            ->with(['logo', 'creator', 'updater', 'verifier'])
            ->find($id);
    }

    public function update(Company $company, array $attributes): Company
    {
        $company->update($attributes);

        return $company->fresh(['logo', 'creator', 'updater', 'verifier']);
    }
}
