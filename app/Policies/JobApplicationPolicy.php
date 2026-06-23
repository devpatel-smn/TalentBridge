<?php

namespace App\Policies;

use App\Models\JobApplication;
use App\Models\User;
use App\Support\Permissions;

class JobApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::APPLICATIONS_VIEW)
            && ($user->isAdmin() || $user->isEmployer() || $user->isJobSeeker());
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::JOBS_VIEW) && $user->isJobSeeker();
    }

    public function view(User $user, JobApplication $application): bool
    {
        if ($user->can(Permissions::APPLICATIONS_VIEW) && $user->isAdmin()) {
            return true;
        }

        if ($user->isJobSeeker()
            && $application->jobSeekerProfile?->user_id === $user->id) {
            return true;
        }

        return $user->isEmployer()
            && $application->job !== null
            && $user->belongsToCompany($application->job->company_id);
    }

    public function manage(User $user, JobApplication $application): bool
    {
        if ($user->can(Permissions::APPLICATIONS_MANAGE) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer()
            && $user->belongsToCompany($application->job?->company_id)
            && $user->can(Permissions::APPLICATIONS_MANAGE);
    }

    public function delete(User $user, JobApplication $application): bool
    {
        return $user->isJobSeeker()
            && $application->jobSeekerProfile?->user_id === $user->id
            && $user->can(Permissions::APPLICATIONS_VIEW);
    }
}
