<?php

namespace App\Modules\Interview\Support;

use App\Models\Interview;
use Illuminate\Support\Carbon;

final class InterviewMailContext
{
    /**
     * @return array<string, mixed>
     */
    public static function fromInterview(Interview $interview): array
    {
        $application = $interview->jobApplication;
        $candidate = $application?->jobSeekerProfile?->user;
        $scheduledAt = $interview->scheduled_at instanceof Carbon
            ? $interview->scheduled_at->copy()->timezone($interview->timezone)
            : null;

        return [
            'candidateName' => $candidate?->full_name ?? 'Candidate',
            'companyName' => $interview->company?->name ?? 'Company',
            'jobTitle' => $application?->job?->title ?? ($interview->title ?? 'Interview'),
            'interviewTitle' => $interview->title ?? $application?->job?->title ?? 'Interview',
            'interviewDate' => $scheduledAt?->format('l, F j, Y') ?? '—',
            'interviewTime' => $scheduledAt?->format('g:i A') ?? '—',
            'timezone' => $interview->timezone,
            'interviewType' => $interview->interview_type->value,
            'meetingLink' => $interview->meeting_link,
            'notes' => $interview->instructions,
            'durationMinutes' => $interview->duration_minutes,
            'location' => $interview->location,
        ];
    }
}
