<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class InterviewScheduledNotification extends TalentBridgeNotification
{
    public static function create(
        string $title,
        string $scheduledAt,
        string $interviewUuid,
        string $roleContext,
    ): self {
        return new self(new NotificationData(
            type: NotificationType::InterviewScheduled,
            title: 'Interview Scheduled',
            body: "{$title} is scheduled for {$scheduledAt}.",
            actionUrl: "{$roleContext}/interviews/{$interviewUuid}",
            icon: 'interview',
            entityType: 'interview',
            entityUuid: $interviewUuid,
        ));
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::InterviewScheduled;
    }
}
