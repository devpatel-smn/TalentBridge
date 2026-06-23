<?php

namespace App\Policies;

use App\Models\ActivityLog;
use App\Models\User;
use App\Support\Permissions;

class ActivityLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::AUDIT_VIEW);
    }

    public function view(User $user, ActivityLog $activityLog): bool
    {
        return $user->can(Permissions::AUDIT_VIEW);
    }
}
