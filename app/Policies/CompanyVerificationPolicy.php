<?php

namespace App\Policies;

use App\Models\CompanyVerification;
use App\Models\User;
use App\Support\Permissions;

class CompanyVerificationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::VERIFICATIONS_REVIEW)
            || $user->isEmployer();
    }

    public function view(User $user, CompanyVerification $verification): bool
    {
        if ($user->can(Permissions::VERIFICATIONS_REVIEW)) {
            return true;
        }

        return $user->isEmployer()
            && $user->belongsToCompany($verification->company_id);
    }

    public function create(User $user): bool
    {
        return $user->isEmployer();
    }

    public function review(User $user): bool
    {
        return $user->can(Permissions::VERIFICATIONS_REVIEW);
    }
}
