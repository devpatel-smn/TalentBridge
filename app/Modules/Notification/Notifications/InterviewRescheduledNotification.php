<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class InterviewRescheduledNotification extends TalentBridgeNotification
{
    public static function create(
        string $title,
        string $newScheduledAt,
        string $interviewUuid,
        string $roleContext,
    ): self {
        return new self(new NotificationData(
            type: NotificationType::InterviewScheduled,
            title: 'Interview Rescheduled',
            body: "Interview \"{$title}\" has been rescheduled to {$newScheduledAt}.",
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
