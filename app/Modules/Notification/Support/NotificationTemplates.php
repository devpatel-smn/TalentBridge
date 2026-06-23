<?php

namespace App\Modules\Notification\Support;

use App\Enums\NotificationType;

final class NotificationTemplates
{
    /**
     * @return array<string, string>
     */
    public static function emailViewFor(NotificationType $type): string
    {
        return match ($type) {
            NotificationType::ApplicationStatus => 'emails.notifications.application-status',
            NotificationType::InterviewScheduled => 'emails.notifications.interview-scheduled',
            NotificationType::InterviewReminder => 'emails.notifications.interview-reminder',
            NotificationType::JobMatch => 'emails.notifications.job-match',
            NotificationType::VerificationUpdate => 'emails.notifications.verification-update',
            NotificationType::System => 'emails.notifications.system',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            NotificationType::ApplicationStatus->value => 'Application Updates',
            NotificationType::InterviewScheduled->value => 'Interview Scheduling',
            NotificationType::InterviewReminder->value => 'Interview Reminders',
            NotificationType::JobMatch->value => 'Job Matches',
            NotificationType::VerificationUpdate->value => 'Verification Updates',
            NotificationType::System->value => 'System Alerts',
        ];
    }
}
