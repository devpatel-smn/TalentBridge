<?php

namespace App\Policies;

use App\Models\JobSeekerProfile;
use App\Models\User;
use App\Support\Permissions;

class JobSeekerProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::PROFILES_VIEW);
    }

    public function view(User $user, JobSeekerProfile $profile): bool
    {
        if ($user->can(Permissions::PROFILES_VIEW) && $user->isAdmin()) {
            return true;
        }

        return $user->id === $profile->user_id;
    }

    public function update(User $user, JobSeekerProfile $profile): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE)
            && $user->id === $profile->user_id;
    }
}
