<?php

namespace App\Modules\Notification\Repositories\Contracts;

use App\Models\DatabaseNotification;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface NotificationRepositoryInterface
{
    public function paginateForUser(User $user, ListQueryParams $params): LengthAwarePaginator;

    public function findForUser(User $user, string $id): DatabaseNotification;

    public function unreadCountForUser(User $user): int;

    public function markAsRead(User $user, string $id): DatabaseNotification;

    public function markAsUnread(User $user, string $id): DatabaseNotification;

    public function markAllAsRead(User $user): int;

    /**
     * @param  list<string>  $ids
     */
    public function markManyAsRead(User $user, array $ids): int;

    /**
     * @param  list<string>  $ids
     */
    public function markManyAsUnread(User $user, array $ids): int;

    /**
     * @return Collection<int, DatabaseNotification>
     */
    public function listUnreadForUser(User $user, int $limit = 50): Collection;
}
