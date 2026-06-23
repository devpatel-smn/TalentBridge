<?php

namespace App\Modules\Notification\Repositories;

use App\Enums\NotificationType;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Modules\Notification\Repositories\Contracts\NotificationPreferenceRepositoryInterface;
use Illuminate\Support\Collection;

class NotificationPreferenceRepository implements NotificationPreferenceRepositoryInterface
{
    public function allForUser(User $user): Collection
    {
        return NotificationPreference::query()
            ->where('user_id', $user->id)
            ->orderBy('notification_type')
            ->get();
    }

    public function findForUserAndType(User $user, NotificationType $type): ?NotificationPreference
    {
        return NotificationPreference::query()
            ->where('user_id', $user->id)
            ->forType($type)
            ->first();
    }

    public function upsertMany(User $user, array $preferences): Collection
    {
        $saved = collect();

        foreach ($preferences as $preference) {
            $type = NotificationType::from((string) $preference['notification_type']);

            $saved->push(
                NotificationPreference::query()->updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'notification_type' => $type,
                    ],
                    [
                        'channel_mail' => (bool) ($preference['channel_mail'] ?? true),
                        'channel_database' => (bool) ($preference['channel_database'] ?? true),
                        'channel_push' => false,
                    ],
                )
            );
        }

        return $saved;
    }
}
