<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class InterviewReminderNotification extends TalentBridgeNotification
{
    public function __construct(
        NotificationData $data,
    ) {
        parent::__construct($data);
        $this->onQueue('notifications');
    }

    public static function create(
        string $title,
        string $scheduledAt,
        string $interviewUuid,
        string $roleContext,
        string $reminderLabel,
    ): self {
        return new self(new NotificationData(
            type: NotificationType::InterviewReminder,
            title: 'Interview Reminder',
            body: "{$reminderLabel}: {$title} is scheduled for {$scheduledAt}.",
            actionUrl: "{$roleContext}/interviews?uuid={$interviewUuid}",
            icon: 'interview',
            entityType: 'interview',
            entityUuid: $interviewUuid,
        ));
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::InterviewReminder;
    }
}
