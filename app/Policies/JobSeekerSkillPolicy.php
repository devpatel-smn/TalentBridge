<?php

namespace App\Policies;

use App\Models\JobSeekerSkill;
use App\Models\User;
use App\Support\Permissions;

class JobSeekerSkillPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE) && $user->isJobSeeker();
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE) && $user->isJobSeeker();
    }

    public function delete(User $user, JobSeekerSkill $jobSeekerSkill): bool
    {
        return $user->can(Permissions::PROFILES_MANAGE)
            && $jobSeekerSkill->jobSeekerProfile?->user_id === $user->id;
    }
}
