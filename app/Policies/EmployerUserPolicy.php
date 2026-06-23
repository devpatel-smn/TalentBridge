<?php

namespace App\Policies;

use App\Models\EmployerUser;
use App\Models\User;
use App\Support\Permissions;

class EmployerUserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEmployer() && $user->can(Permissions::COMPANIES_VIEW);
    }

    public function view(User $user, EmployerUser $member): bool
    {
        return $user->isEmployer()
            && $user->belongsToCompany($member->company_id);
    }

    public function create(User $user): bool
    {
        return $user->isEmployer() && $user->can(Permissions::COMPANIES_UPDATE);
    }

    public function update(User $user, EmployerUser $member): bool
    {
        return $user->isEmployer()
            && $user->can(Permissions::COMPANIES_UPDATE)
            && $user->belongsToCompany($member->company_id);
    }

    public function delete(User $user, EmployerUser $member): bool
    {
        return $user->isEmployer()
            && $user->can(Permissions::COMPANIES_UPDATE)
            && $user->belongsToCompany($member->company_id);
    }
}
