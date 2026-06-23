<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class ApplicationStatusChangedNotification extends TalentBridgeNotification
{
    public static function forCandidate(
        string $jobTitle,
        string $companyName,
        string $statusLabel,
        string $applicationUuid,
    ): self {
        return new self(new NotificationData(
            type: NotificationType::ApplicationStatus,
            title: 'Application Status Updated',
            body: "Your application for {$jobTitle} at {$companyName} is now {$statusLabel}.",
            actionUrl: "/job-seeker/applications/{$applicationUuid}",
            icon: 'application',
            entityType: 'job_application',
            entityUuid: $applicationUuid,
        ));
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::ApplicationStatus;
    }
}
