<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Models\Interview;
use App\Modules\Interview\Support\InterviewMailContext;
use App\Modules\Notification\Support\NotificationData;
use Illuminate\Notifications\Messages\MailMessage;

class InterviewCancelledNotification extends InterviewScheduledNotification
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
            actionUrl: "{$roleContext}/interviews?uuid={$interviewUuid}",
            icon: 'interview',
            entityType: 'interview',
            entityUuid: $interviewUuid,
        ));
    }

    public static function createForInterview(
        Interview $interview,
        string $roleContext,
        ?string $reason = null,
    ): self {
        $mailContext = InterviewMailContext::fromInterview($interview);
        $body = $reason !== null
            ? "Your interview for {$mailContext['jobTitle']} at {$mailContext['companyName']} was cancelled. Reason: {$reason}"
            : "Your interview for {$mailContext['jobTitle']} at {$mailContext['companyName']} was cancelled.";

        return new self(new NotificationData(
            type: NotificationType::InterviewScheduled,
            title: 'Interview Cancelled',
            body: $body,
            actionUrl: "{$roleContext}/interviews?uuid={$interview->uuid}",
            icon: 'interview',
            entityType: 'interview',
            entityUuid: $interview->uuid,
            meta: array_merge($mailContext, ['cancellationReason' => $reason]),
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
            view: 'emails.notifications.interview-cancelled',
            headline: 'Interview Cancelled',
        );
    }
}
