<?php

namespace App\Modules\Notification\Services;

use App\Enums\NotificationType;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Modules\Notification\Repositories\Contracts\NotificationPreferenceRepositoryInterface;
use App\Modules\Notification\Support\NotificationTemplates;
use Illuminate\Support\Collection;

class NotificationPreferenceService
{
    public function __construct(
        private readonly NotificationPreferenceRepositoryInterface $preferenceRepository,
    ) {}

    /**
     * @return list<string>
     */
    public function resolveChannels(User $user, NotificationType $type): array
    {
        $preference = $this->preferenceRepository->findForUserAndType($user, $type);
        $channels = [];

        $mailEnabled = $preference?->channel_mail ?? true;
        $databaseEnabled = $preference?->channel_database ?? true;

        if ($type === NotificationType::System) {
            $mailEnabled = true;
        }

        if ($databaseEnabled) {
            $channels[] = 'database';
        }

        if ($mailEnabled) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function listWithDefaults(User $user): Collection
    {
        $existing = $this->preferenceRepository->allForUser($user)
            ->keyBy(fn (NotificationPreference $preference) => $preference->notification_type->value);

        return collect(NotificationType::cases())->map(function (NotificationType $type) use ($existing) {
            $preference = $existing->get($type->value);

            return [
                'notification_type' => $type->value,
                'label' => NotificationTemplates::labels()[$type->value] ?? $type->value,
                'channel_mail' => $preference?->channel_mail ?? true,
                'channel_database' => $preference?->channel_database ?? true,
                'channel_push' => false,
                'is_configured' => $preference !== null,
                'mail_locked' => $type === NotificationType::System,
            ];
        });
    }

    /**
     * @param  array<int, array<string, mixed>>  $preferences
     * @return Collection<int, NotificationPreference>
     */
    public function update(User $user, array $preferences): Collection
    {
        $normalized = collect($preferences)->map(function (array $preference) {
            $type = NotificationType::from((string) $preference['notification_type']);

            return [
                'notification_type' => $type->value,
                'channel_mail' => $type === NotificationType::System
                    ? true
                    : (bool) ($preference['channel_mail'] ?? true),
                'channel_database' => (bool) ($preference['channel_database'] ?? true),
                'channel_push' => false,
            ];
        })->all();

        return $this->preferenceRepository->upsertMany($user, $normalized);
    }
}
