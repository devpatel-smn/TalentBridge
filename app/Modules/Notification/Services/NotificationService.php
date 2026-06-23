<?php

namespace App\Modules\Notification\Services;

use App\Enums\AuditAction;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\DatabaseNotification;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Notification\Notifications\TalentBridgeNotification;
use App\Modules\Notification\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class NotificationService
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository,
    ) {}

    public function list(User $user, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->notificationRepository->paginateForUser($user, $params);
    }

    public function find(User $user, string $id): DatabaseNotification
    {
        return $this->notificationRepository->findForUser($user, $id);
    }

    public function unreadCount(User $user): int
    {
        return $this->notificationRepository->unreadCountForUser($user);
    }

    public function markAsRead(User $user, string $id, ?Request $request = null): DatabaseNotification
    {
        $notification = $this->notificationRepository->markAsRead($user, $id);
        $this->logReadActivity($user, $notification, 'notification.read', $request);

        return $notification;
    }

    public function markAsUnread(User $user, string $id, ?Request $request = null): DatabaseNotification
    {
        $notification = $this->notificationRepository->markAsUnread($user, $id);
        $this->logReadActivity($user, $notification, 'notification.unread', $request);

        return $notification;
    }

    public function markAllAsRead(User $user, ?Request $request = null): int
    {
        $count = $this->notificationRepository->markAllAsRead($user);

        if ($count > 0) {
            $this->logBulkReadActivity($user, $count, 'notification.read_all', $request);
        }

        return $count;
    }

    /**
     * @param  list<string>  $ids
     */
    public function markManyAsRead(User $user, array $ids, ?Request $request = null): int
    {
        $count = $this->notificationRepository->markManyAsRead($user, $ids);

        if ($count > 0) {
            $this->logBulkReadActivity($user, $count, 'notification.bulk_read', $request, $ids);
        }

        return $count;
    }

    /**
     * @param  list<string>  $ids
     */
    public function markManyAsUnread(User $user, array $ids, ?Request $request = null): int
    {
        $count = $this->notificationRepository->markManyAsUnread($user, $ids);

        if ($count > 0) {
            $this->logBulkReadActivity($user, $count, 'notification.bulk_unread', $request, $ids);
        }

        return $count;
    }

    public function dispatch(User $user, Notification $notification, bool $queue = true): void
    {
        if ($queue) {
            $user->notify($notification);

            return;
        }

        $user->notifyNow($notification);
    }

    /**
     * @param  iterable<User>  $users
     */
    public function dispatchToMany(iterable $users, Notification $notification, bool $queue = true): void
    {
        foreach ($users as $user) {
            $this->dispatch($user, $notification, $queue);
        }
    }

    /**
     * @param  Collection<int, User>  $users
     */
    public function dispatchSystemNotification(
        Collection $users,
        TalentBridgeNotification $notification,
        User $actor,
        ?Request $request = null,
    ): int {
        $this->dispatchToMany($users, $notification);

        AuditLog::query()->create([
            'user_id' => $actor->id,
            'action' => AuditAction::Created,
            'auditable_type' => User::class,
            'auditable_id' => $actor->id,
            'old_values' => null,
            'new_values' => [
                'notification_class' => $notification::class,
                'recipient_count' => $users->count(),
            ],
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'created_at' => now(),
        ]);

        return $users->count();
    }

    private function logReadActivity(
        User $user,
        DatabaseNotification $notification,
        string $activityType,
        ?Request $request,
    ): void {
        ActivityLog::query()->create([
            'user_id' => $user->id,
            'company_id' => null,
            'activity_type' => $activityType,
            'description' => 'Notification marked as '.($activityType === 'notification.unread' ? 'unread' : 'read').'.',
            'subject_type' => DatabaseNotification::class,
            'subject_id' => null,
            'properties' => [
                'notification_id' => $notification->id,
                'ip_address' => $request?->ip(),
            ],
            'created_at' => now(),
        ]);
    }

    /**
     * @param  list<string>|null  $ids
     */
    private function logBulkReadActivity(
        User $user,
        int $count,
        string $activityType,
        ?Request $request,
        ?array $ids = null,
    ): void {
        ActivityLog::query()->create([
            'user_id' => $user->id,
            'company_id' => null,
            'activity_type' => $activityType,
            'description' => "{$count} notification(s) updated.",
            'subject_type' => DatabaseNotification::class,
            'subject_id' => null,
            'properties' => [
                'count' => $count,
                'notification_ids' => $ids,
                'ip_address' => $request?->ip(),
            ],
            'created_at' => now(),
        ]);
    }
}
