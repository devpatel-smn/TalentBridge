<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class ApplicationSubmittedNotification extends TalentBridgeNotification
{
    public static function forEmployer(
        string $candidateName,
        string $jobTitle,
        string $applicationUuid,
        string $jobUuid,
    ): self {
        return new self(new NotificationData(
            type: NotificationType::ApplicationStatus,
            title: 'New Application Received',
            body: "{$candidateName} applied for {$jobTitle}.",
            actionUrl: "/employer/applicants/{$applicationUuid}",
            icon: 'application',
            entityType: 'job_application',
            entityUuid: $applicationUuid,
            meta: ['job_uuid' => $jobUuid],
        ));
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::ApplicationStatus;
    }
}
