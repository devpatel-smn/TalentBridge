<?php

namespace App\Policies;

use App\Enums\JobStatus;
use App\Models\Job;
use App\Models\User;
use App\Support\Permissions;

class JobPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::JOBS_VIEW);
    }

    public function view(?User $user, Job $job): bool
    {
        if ($job->status === JobStatus::Published) {
            return true;
        }

        if (! $user) {
            return false;
        }

        if ($user->can(Permissions::JOBS_VIEW) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer() && $user->belongsToCompany($job->company_id);
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::JOBS_CREATE);
    }

    public function update(User $user, Job $job): bool
    {
        if ($user->can(Permissions::JOBS_UPDATE) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer()
            && $user->belongsToCompany($job->company_id)
            && $user->can(Permissions::JOBS_UPDATE);
    }

    public function delete(User $user, Job $job): bool
    {
        if ($user->can(Permissions::JOBS_DELETE) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer()
            && $user->belongsToCompany($job->company_id)
            && $user->can(Permissions::JOBS_DELETE);
    }

    public function publish(User $user, Job $job): bool
    {
        if ($user->can(Permissions::JOBS_PUBLISH) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer()
            && $user->belongsToCompany($job->company_id)
            && $user->can(Permissions::JOBS_PUBLISH);
    }

    public function close(User $user, Job $job): bool
    {
        return $this->publish($user, $job);
    }

    public function archive(User $user, Job $job): bool
    {
        return $this->update($user, $job);
    }

    public function viewAnalytics(User $user, Job $job): bool
    {
        if ($user->can(Permissions::ANALYTICS_VIEW) && $user->isAdmin()) {
            return true;
        }

        return $user->isEmployer()
            && $user->belongsToCompany($job->company_id)
            && $user->can(Permissions::ANALYTICS_VIEW);
    }
}
