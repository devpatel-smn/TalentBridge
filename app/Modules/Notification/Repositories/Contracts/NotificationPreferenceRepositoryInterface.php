<?php

namespace App\Modules\Notification\Repositories\Contracts;

use App\Enums\NotificationType;
use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Support\Collection;

interface NotificationPreferenceRepositoryInterface
{
    /**
     * @return Collection<int, NotificationPreference>
     */
    public function allForUser(User $user): Collection;

    public function findForUserAndType(User $user, NotificationType $type): ?NotificationPreference;

    /**
     * @param  array<int, array<string, mixed>>  $preferences
     * @return Collection<int, NotificationPreference>
     */
    public function upsertMany(User $user, array $preferences): Collection;
}
