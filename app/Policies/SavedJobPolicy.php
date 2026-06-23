<?php

namespace App\Policies;

use App\Models\SavedJob;
use App\Models\User;
use App\Support\Permissions;

class SavedJobPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::JOBS_VIEW) && $user->isJobSeeker();
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::JOBS_VIEW) && $user->isJobSeeker();
    }

    public function delete(User $user, SavedJob $savedJob): bool
    {
        return $user->can(Permissions::JOBS_VIEW)
            && $savedJob->jobSeekerProfile?->user_id === $user->id;
    }
}
