<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class JobMatchNotification extends TalentBridgeNotification
{
    public static function create(
        string $jobTitle,
        string $companyName,
        float $score,
        string $jobUuid,
    ): self {
        return new self(new NotificationData(
            type: NotificationType::JobMatch,
            title: 'New Job Match',
            body: "We found a {$score}% match: {$jobTitle} at {$companyName}.",
            actionUrl: "/jobs/{$jobUuid}",
            icon: 'job-match',
            entityType: 'job',
            entityUuid: $jobUuid,
            meta: ['score' => $score],
        ));
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::JobMatch;
    }
}
