<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class SystemNotification extends TalentBridgeNotification
{
    public static function create(
        string $title,
        string $body,
        ?string $actionUrl = null,
        bool $forceEmail = true,
    ): self {
        return new self(
            new NotificationData(
                type: NotificationType::System,
                title: $title,
                body: $body,
                actionUrl: $actionUrl,
                icon: 'system',
                meta: ['force_email' => $forceEmail],
            )
        );
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::System;
    }
}
