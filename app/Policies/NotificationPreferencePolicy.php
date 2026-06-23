<?php

namespace App\Policies;

use App\Models\NotificationPreference;
use App\Models\User;

class NotificationPreferencePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActiveAccount();
    }

    public function view(User $user, NotificationPreference $preference): bool
    {
        return $preference->user_id === $user->id;
    }

    public function update(User $user, ?NotificationPreference $preference = null): bool
    {
        if ($preference !== null && $preference->user_id !== $user->id) {
            return false;
        }

        return $user->isActiveAccount();
    }
}
