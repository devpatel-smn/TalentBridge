<?php

namespace App\Modules\Notification\Services;

use App\Models\Role;
use App\Models\User;
use App\Modules\Notification\Notifications\SystemNotification;
use Illuminate\Support\Collection;

class NotificationDispatchService
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function notifyUser(User $user, SystemNotification $notification): void
    {
        $this->notificationService->dispatch($user, $notification);
    }

    /**
     * @return Collection<int, User>
     */
    public function usersForRole(string $role): Collection
    {
        return User::query()
            ->role($role)
            ->active()
            ->get();
    }

    public function notifyRole(string $role, SystemNotification $notification, User $actor, ?\Illuminate\Http\Request $request = null): int
    {
        $users = $this->usersForRole($role);

        return $this->notificationService->dispatchSystemNotification($users, $notification, $actor, $request);
    }

    public function notifyAdmins(SystemNotification $notification, User $actor, ?\Illuminate\Http\Request $request = null): int
    {
        return $this->notifyRole(Role::ADMIN, $notification, $actor, $request);
    }

    public function notifyEmployers(SystemNotification $notification, User $actor, ?\Illuminate\Http\Request $request = null): int
    {
        return $this->notifyRole(Role::EMPLOYER, $notification, $actor, $request);
    }

    public function notifyJobSeekers(SystemNotification $notification, User $actor, ?\Illuminate\Http\Request $request = null): int
    {
        return $this->notifyRole(Role::JOB_SEEKER, $notification, $actor, $request);
    }
}
