export const COMMON_TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
] as const;

export const INTERVIEW_TYPE_OPTIONS = [
    { value: 'video', label: 'Video' },
    { value: 'phone', label: 'Phone' },
    { value: 'onsite', label: 'In Person' },
] as const;

export const SCHEDULABLE_APPLICATION_STATUSES = [
    'shortlisted',
    'offered',
    'interview_scheduled',
    'interviewed',
] as const;

export function getDefaultTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
        return 'UTC';
    }
}

export function buildScheduledAt(date: string, time: string): string {
    return `${date}T${time}:00`;
}

export function splitScheduledAt(scheduledAt: string, timezone?: string): { date: string; time: string } {
    const date = new Date(scheduledAt);
    const tz = timezone ?? getDefaultTimezone();

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(date);

    const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const year = lookup.year ?? '1970';
    const month = lookup.month ?? '01';
    const day = lookup.day ?? '01';
    const hour = lookup.hour ?? '00';
    const minute = lookup.minute ?? '00';

    return {
        date: `${year}-${month}-${day}`,
        time: `${hour}:${minute}`,
    };
}

export function getCandidateName(interview: {
    job_application?: {
        candidate?: { user?: { full_name?: string } };
        job_seeker_profile?: { user?: { full_name?: string } };
    };
}): string {
    return (
        interview.job_application?.candidate?.user?.full_name ??
        interview.job_application?.job_seeker_profile?.user?.full_name ??
        '—'
    );
}

export function canJobSeekerRespond(interview: { status: string; scheduled_at: string }): boolean {
    return (
        ['scheduled', 'rescheduled'].includes(interview.status) &&
        new Date(interview.scheduled_at) > new Date()
    );
}

export function canEmployerManage(interview: { status: string }): boolean {
    return ['scheduled', 'confirmed', 'rescheduled'].includes(interview.status);
}
