<?php

namespace App\Enums;

enum NotificationType: string
{
    case ApplicationStatus = 'application_status';
    case InterviewScheduled = 'interview_scheduled';
    case InterviewReminder = 'interview_reminder';
    case JobMatch = 'job_match';
    case VerificationUpdate = 'verification_update';
    case System = 'system';
}
