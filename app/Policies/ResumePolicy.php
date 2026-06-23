<?php

namespace App\Policies;

use App\Models\Resume;
use App\Models\User;
use App\Support\Permissions;

class ResumePolicy
{
    public function view(User $user, Resume $resume): bool
    {
        if ($user->can(Permissions::PROFILES_VIEW) && $user->isAdmin()) {
            return true;
        }

        return $resume->jobSeekerProfile?->user_id === $user->id;
    }

    public function manage(User $user, Resume $resume): bool
    {
        return $user->can(Permissions::RESUMES_MANAGE)
            && $resume->jobSeekerProfile?->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::RESUMES_MANAGE) && $user->isJobSeeker();
    }

    public function delete(User $user, Resume $resume): bool
    {
        return $this->manage($user, $resume);
    }
}
