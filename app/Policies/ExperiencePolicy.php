<?php

namespace App\Policies;

use App\Models\Experience;
use App\Models\User;
use App\Support\Permissions;

class ExperiencePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE) && $user->isJobSeeker();
    }

    public function view(User $user, Experience $experience): bool
    {
        return $this->ownsExperience($user, $experience);
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE) && $user->isJobSeeker();
    }

    public function update(User $user, Experience $experience): bool
    {
        return $this->ownsExperience($user, $experience);
    }

    public function delete(User $user, Experience $experience): bool
    {
        return $this->ownsExperience($user, $experience);
    }

    private function ownsExperience(User $user, Experience $experience): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE)
            && $experience->jobSeekerProfile?->user_id === $user->id;
    }
}
