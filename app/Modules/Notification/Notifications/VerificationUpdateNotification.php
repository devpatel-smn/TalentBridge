<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Support\NotificationData;

class VerificationUpdateNotification extends TalentBridgeNotification
{
    public static function approved(string $companyName): self
    {
        return new self(new NotificationData(
            type: NotificationType::VerificationUpdate,
            title: 'Company Verification Approved',
            body: "Your company \"{$companyName}\" has been verified. You can now publish jobs and manage applicants.",
            actionUrl: '/employer/verification',
            icon: 'verification',
            entityType: 'company',
        ));
    }

    public static function rejected(string $companyName, string $reason): self
    {
        return new self(new NotificationData(
            type: NotificationType::VerificationUpdate,
            title: 'Company Verification Rejected',
            body: "Verification for \"{$companyName}\" was rejected. Reason: {$reason}",
            actionUrl: '/employer/verification',
            icon: 'verification',
            entityType: 'company',
        ));
    }

    public static function resubmissionRequired(string $companyName, string $notes): self
    {
        return new self(new NotificationData(
            type: NotificationType::VerificationUpdate,
            title: 'Verification Resubmission Required',
            body: "Additional information is required for \"{$companyName}\". {$notes}",
            actionUrl: '/employer/verification',
            icon: 'verification',
            entityType: 'company',
        ));
    }

    public function notificationType(): NotificationType
    {
        return NotificationType::VerificationUpdate;
    }
}
