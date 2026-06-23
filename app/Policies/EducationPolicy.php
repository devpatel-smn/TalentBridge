<?php

namespace App\Policies;

use App\Models\Education;
use App\Models\User;
use App\Support\Permissions;

class EducationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE) && $user->isJobSeeker();
    }

    public function view(User $user, Education $education): bool
    {
        return $this->ownsEducation($user, $education);
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE) && $user->isJobSeeker();
    }

    public function update(User $user, Education $education): bool
    {
        return $this->ownsEducation($user, $education);
    }

    public function delete(User $user, Education $education): bool
    {
        return $this->ownsEducation($user, $education);
    }

    private function ownsEducation(User $user, Education $education): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE)
            && $education->jobSeekerProfile?->user_id === $user->id;
    }
}
