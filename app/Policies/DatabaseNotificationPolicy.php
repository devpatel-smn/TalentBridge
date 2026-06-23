<?php

namespace App\Policies;

use App\Models\DatabaseNotification;
use App\Models\User;

class DatabaseNotificationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActiveAccount();
    }

    public function view(User $user, DatabaseNotification $notification): bool
    {
        return $this->ownsNotification($user, $notification);
    }

    public function update(User $user, DatabaseNotification $notification): bool
    {
        return $this->ownsNotification($user, $notification);
    }

    private function ownsNotification(User $user, DatabaseNotification $notification): bool
    {
        return $notification->notifiable_type === $user->getMorphClass()
            && (int) $notification->notifiable_id === $user->id;
    }
}
