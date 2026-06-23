<?php

namespace App\Modules\Notification\Repositories;

use App\Models\DatabaseNotification;
use App\Models\User;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Notification\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class NotificationRepository implements NotificationRepositoryInterface
{
    use AppliesListQuery;

    public function paginateForUser(User $user, ListQueryParams $params): LengthAwarePaginator
    {
        $query = $this->baseQuery($user);

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['created_at', 'read_at'],
            'created_at',
        );

        if (isset($params->filters['read'])) {
            $readFilter = filter_var($params->filters['read'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

            if ($readFilter === true) {
                $query->read();
            } elseif ($readFilter === false) {
                $query->unread();
            }
        }

        if (isset($params->filters['notification_type']) && $params->filters['notification_type'] !== '') {
            $query->where('data->notification_type', (string) $params->filters['notification_type']);
        }

        return $query->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function findForUser(User $user, string $id): DatabaseNotification
    {
        return $this->baseQuery($user)->whereKey($id)->firstOrFail();
    }

    public function unreadCountForUser(User $user): int
    {
        return $this->baseQuery($user)->unread()->count();
    }

    public function markAsRead(User $user, string $id): DatabaseNotification
    {
        $notification = $this->findForUser($user, $id);

        if ($notification->read_at === null) {
            $notification->forceFill(['read_at' => now()])->save();
        }

        return $notification->refresh();
    }

    public function markAsUnread(User $user, string $id): DatabaseNotification
    {
        $notification = $this->findForUser($user, $id);

        if ($notification->read_at !== null) {
            $notification->forceFill(['read_at' => null])->save();
        }

        return $notification->refresh();
    }

    public function markAllAsRead(User $user): int
    {
        return $this->baseQuery($user)
            ->unread()
            ->update(['read_at' => now()]);
    }

    public function markManyAsRead(User $user, array $ids): int
    {
        if ($ids === []) {
            return 0;
        }

        return $this->baseQuery($user)
            ->whereIn('id', $ids)
            ->unread()
            ->update(['read_at' => now()]);
    }

    public function markManyAsUnread(User $user, array $ids): int
    {
        if ($ids === []) {
            return 0;
        }

        return $this->baseQuery($user)
            ->whereIn('id', $ids)
            ->read()
            ->update(['read_at' => null]);
    }

    public function listUnreadForUser(User $user, int $limit = 50): Collection
    {
        return $this->baseQuery($user)
            ->unread()
            ->limit($limit)
            ->get();
    }

    /**
     * @return Builder<DatabaseNotification>
     */
    private function baseQuery(User $user): Builder
    {
        return DatabaseNotification::query()
            ->where('notifiable_type', $user->getMorphClass())
            ->where('notifiable_id', $user->getKey());
    }
}
