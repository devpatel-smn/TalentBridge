<?php

namespace App\Policies;

use App\Models\Interview;
use App\Models\User;
use App\Support\Permissions;

class InterviewPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::INTERVIEWS_VIEW);
    }

    public function view(User $user, Interview $interview): bool
    {
        if ($user->can(Permissions::INTERVIEWS_VIEW) && $user->isAdmin()) {
            return true;
        }

        if ($user->isEmployer() && $user->belongsToCompany($interview->company_id)) {
            return true;
        }

        return $user->isJobSeeker()
            && $interview->jobApplication?->jobSeekerProfile?->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::INTERVIEWS_MANAGE)
            && ($user->isEmployer() || $user->isAdmin());
    }

    public function manage(User $user, Interview $interview): bool
    {
        if ($user->can(Permissions::INTERVIEWS_MANAGE) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer()
            && $user->belongsToCompany($interview->company_id)
            && $user->can(Permissions::INTERVIEWS_MANAGE);
    }

    public function update(User $user, Interview $interview): bool
    {
        return $this->manage($user, $interview);
    }

    public function delete(User $user, Interview $interview): bool
    {
        return $this->manage($user, $interview);
    }

    public function respond(User $user, Interview $interview): bool
    {
        return $user->isJobSeeker()
            && $interview->jobApplication?->jobSeekerProfile?->user_id === $user->id;
    }
}
