<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use App\Support\Permissions;

class CompanyPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::COMPANIES_VIEW);
    }

    public function view(User $user, Company $company): bool
    {
        if ($user->can(Permissions::COMPANIES_VIEW)) {
            return true;
        }

        return $user->belongsToCompany($company->id);
    }

    public function update(User $user, Company $company): bool
    {
        if ($user->can(Permissions::COMPANIES_UPDATE) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer() && $user->belongsToCompany($company->id);
    }

    public function verify(User $user): bool
    {
        return $user->can(Permissions::COMPANIES_VERIFY);
    }

    public function delete(User $user, Company $company): bool
    {
        return $user->can(Permissions::COMPANIES_UPDATE) && $user->isAdmin();
    }
}
