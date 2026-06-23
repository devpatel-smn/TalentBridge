<?php

namespace App\Modules\Notification\Notifications\Concerns;

use App\Enums\NotificationType;
use App\Models\User;
use App\Modules\Notification\Services\NotificationPreferenceService;

trait RespectsNotificationPreferences
{
    abstract public function notificationType(): NotificationType;

    /**
     * @return list<string>
     */
    protected function resolveChannels(object $notifiable): array
    {
        if (! $notifiable instanceof User) {
            return ['database', 'mail'];
        }

        return app(NotificationPreferenceService::class)
            ->resolveChannels($notifiable, $this->notificationType());
    }
}
