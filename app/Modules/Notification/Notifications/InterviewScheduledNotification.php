<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Models\Interview;
use App\Modules\Interview\Support\InterviewMailContext;
use App\Modules\Notification\Support\NotificationData;
use App\Modules\Notification\Support\NotificationTemplates;
use Illuminate\Notifications\Messages\MailMessage;

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
        $title = $interview->title ?? $interview->jobApplication?->job?->title ?? 'Interview';
        $mailContext = InterviewMailContext::fromInterview($interview);

        return new self(new NotificationData(
            type: NotificationType::InterviewScheduled,
            title: 'Interview Scheduled',
            body: "Your interview for {$mailContext['jobTitle']} at {$mailContext['companyName']} is scheduled for {$formattedScheduledAt}.",
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
            view: NotificationTemplates::emailViewFor(NotificationType::InterviewScheduled),
            headline: 'Interview Scheduled',
        );
    }

    protected function buildInterviewMail(object $notifiable, string $view, string $headline): MailMessage
    {
        $frontendUrl = rtrim((string) config('talentbridge.frontend_url'), '/');
        $actionUrl = $this->data->actionUrl;

        if ($actionUrl !== null && ! str_starts_with($actionUrl, 'http')) {
            $actionUrl = $frontendUrl.'/'.ltrim($actionUrl, '/');
        }

        $context = $this->data->meta !== []
            ? $this->data->meta
            : InterviewMailContext::fromInterview($this->resolveInterview());

        return (new MailMessage)
            ->subject($this->data->title)
            ->markdown($view, array_merge($context, [
                'title' => $headline,
                'body' => $this->data->body,
                'actionUrl' => $actionUrl,
                'recipientName' => method_exists($notifiable, 'getFullNameAttribute')
                    ? $notifiable->full_name
                    : ($notifiable->name ?? 'there'),
            ]));
    }

    protected function resolveInterview(): Interview
    {
        if ($this->data->entityUuid === null) {
            return new Interview;
        }

        return Interview::query()
            ->with(['company', 'jobApplication.job', 'jobApplication.jobSeekerProfile.user'])
            ->where('uuid', $this->data->entityUuid)
            ->first() ?? new Interview;
    }
}
