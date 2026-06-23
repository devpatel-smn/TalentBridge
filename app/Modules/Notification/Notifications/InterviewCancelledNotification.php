<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class InterviewCancelledNotification extends TalentBridgeNotification
{
    public static function create(
        string $title,
        string $interviewUuid,
        string $roleContext,
        ?string $reason = null,
    ): self {
        $body = $reason !== null
            ? "Interview \"{$title}\" was cancelled. Reason: {$reason}"
            : "Interview \"{$title}\" was cancelled.";

        return new self(new NotificationData(
            type: NotificationType::InterviewScheduled,
            title: 'Interview Cancelled',
            body: $body,
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
