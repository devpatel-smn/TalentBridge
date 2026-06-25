<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Models\Interview;
use App\Modules\Interview\Support\InterviewMailContext;
use App\Modules\Notification\Support\NotificationData;
use Illuminate\Notifications\Messages\MailMessage;

class InterviewRescheduledNotification extends InterviewScheduledNotification
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
            actionUrl: "{$roleContext}/interviews?uuid={$interviewUuid}",
            icon: 'interview',
            entityType: 'interview',
            entityUuid: $interviewUuid,
        ));
    }

    public static function createForInterview(
        Interview $interview,
        string $formattedScheduledAt,
        string $roleContext,
    ): self {
        $mailContext = InterviewMailContext::fromInterview($interview);

        return new self(new NotificationData(
            type: NotificationType::InterviewScheduled,
            title: 'Interview Rescheduled',
            body: "Your interview for {$mailContext['jobTitle']} at {$mailContext['companyName']} has been rescheduled to {$formattedScheduledAt}.",
            actionUrl: "{$roleContext}/interviews?uuid={$interview->uuid}",
            icon: 'interview',
            entityType: 'interview',
            entityUuid: $interview->uuid,
            meta: $mailContext,
        ));
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::InterviewScheduled;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return $this->buildInterviewMail(
            notifiable: $notifiable,
            view: 'emails.notifications.interview-rescheduled',
            headline: 'Interview Rescheduled',
        );
    }
}
