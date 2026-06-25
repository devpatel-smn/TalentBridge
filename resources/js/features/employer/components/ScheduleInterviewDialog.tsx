import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { employerApi } from '@/features/employer/api/employer-api';
import {
    buildScheduledAt,
    COMMON_TIMEZONES,
    getDefaultTimezone,
    INTERVIEW_TYPE_OPTIONS,
    splitScheduledAt,
} from '@/features/interviews/lib/interview-utils';
import { getApiErrorMessage, getValidationErrors } from '@/lib/api-client';
import { titleCase } from '@/lib/utils';
import type { Interview, InterviewType, Job, JobApplication } from '@/types/models';

interface ScheduleInterviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    interview?: Interview | null;
    defaultApplicationUuid?: string;
    defaultJobUuid?: string;
}

interface FormState {
    jobUuid: string;
    applicationUuid: string;
    interviewType: InterviewType;
    date: string;
    time: string;
    timezone: string;
    durationMinutes: string;
    meetingLink: string;
    instructions: string;
    title: string;
}

const EMPTY_FORM = (): FormState => ({
    jobUuid: '',
    applicationUuid: '',
    interviewType: 'video',
    date: '',
    time: '',
    timezone: getDefaultTimezone(),
    durationMinutes: '60',
    meetingLink: '',
    instructions: '',
    title: '',
});

function getApplicantLabel(application: JobApplication): string {
    const name =
        application.candidate?.user?.full_name ??
        application.job_seeker_profile?.user?.full_name ??
        application.candidate?.user?.email ??
        'Unknown applicant';

    return `${name} (${titleCase(application.status)})`;
}

/** Prevent Radix Select dropdown clicks from closing the parent dialog. */
function preventSelectClose(event: Event) {
    const target = event.target as HTMLElement | null;
    if (
        target?.closest('[data-radix-select-content]') ||
        target?.closest('[role="listbox"]') ||
        target?.closest('[data-radix-popper-content-wrapper]')
    ) {
        event.preventDefault();
    }
}

export function ScheduleInterviewDialog({
    open,
    onOpenChange,
    onSuccess,
    interview,
    defaultApplicationUuid,
    defaultJobUuid,
}: ScheduleInterviewDialogProps) {
    const isReschedule = Boolean(interview);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: jobsResponse } = useQuery({
        queryKey: ['employer', 'jobs', 'schedule-dialog'],
        queryFn: () => employerApi.jobs.list({ per_page: 100 }),
        enabled: open,
    });

    const jobs = (jobsResponse?.data ?? []) as Job[];

    const { data: applicantsResponse, isLoading: isLoadingApplicants } = useQuery({
        queryKey: ['employer', 'applicants', form.jobUuid, 'schedule-dialog'],
        queryFn: () => employerApi.applicants.list(form.jobUuid, { per_page: 100 }),
        enabled: open && Boolean(form.jobUuid) && !isReschedule,
    });

    const applicants = (applicantsResponse?.data ?? []) as JobApplication[];

    const selectedJob = jobs.find((job) => job.uuid === form.jobUuid);
    const showJobSelect = jobs.length > 1;

    useEffect(() => {
        if (!open || isReschedule || jobs.length === 0) {
            return;
        }

        setForm((prev) => {
            if (prev.jobUuid) {
                return prev;
            }

            const jobUuid = defaultJobUuid ?? jobs[0]?.uuid ?? '';
            return jobUuid ? { ...prev, jobUuid } : prev;
        });
    }, [open, isReschedule, jobs, defaultJobUuid]);

    useEffect(() => {
        if (!open) {
            setForm(EMPTY_FORM());
            setErrors({});
            return;
        }

        if (interview) {
            const { date, time } = splitScheduledAt(interview.scheduled_at, interview.timezone);
            setForm({
                jobUuid: interview.job_application?.job?.uuid ?? '',
                applicationUuid: interview.job_application?.uuid ?? '',
                interviewType: interview.interview_type,
                date,
                time,
                timezone: interview.timezone,
                durationMinutes: String(interview.duration_minutes),
                meetingLink: interview.meeting_link ?? '',
                instructions: interview.instructions ?? '',
                title: interview.title ?? '',
            });
            return;
        }

        const next = EMPTY_FORM();
        if (defaultJobUuid) next.jobUuid = defaultJobUuid;
        if (defaultApplicationUuid) next.applicationUuid = defaultApplicationUuid;
        setForm(next);
    }, [open, interview, defaultApplicationUuid, defaultJobUuid]);

    const mutation = useMutation({
        mutationFn: async () => {
            const scheduledAt = buildScheduledAt(form.date, form.time);
            const payload = {
                scheduled_at: scheduledAt,
                timezone: form.timezone,
                duration_minutes: Number(form.durationMinutes) || 60,
                meeting_link: form.meetingLink || undefined,
                instructions: form.instructions || undefined,
                title: form.title || undefined,
            };

            if (isReschedule && interview) {
                return employerApi.interviews.reschedule(interview.uuid, payload);
            }

            return employerApi.interviews.create({
                application_uuid: form.applicationUuid,
                interview_type: form.interviewType,
                ...payload,
            });
        },
        onSuccess: () => {
            toast.success(isReschedule ? 'Interview rescheduled' : 'Interview scheduled');
            onSuccess();
            onOpenChange(false);
        },
        onError: (error) => {
            const validationErrors = getValidationErrors(error);
            if (validationErrors) {
                const mapped: Record<string, string> = {};
                Object.entries(validationErrors).forEach(([key, messages]) => {
                    if (messages[0]) mapped[key] = messages[0];
                });
                setErrors(mapped);
            }
            toast.error(getApiErrorMessage(error, isReschedule ? 'Failed to reschedule' : 'Failed to schedule interview'));
        },
    });

    const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        mutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
                onPointerDownOutside={preventSelectClose}
                onFocusOutside={preventSelectClose}
                onInteractOutside={preventSelectClose}
            >
                <DialogHeader>
                    <DialogTitle>{isReschedule ? 'Reschedule interview' : 'Schedule interview'}</DialogTitle>
                    <DialogDescription>
                        {isReschedule
                            ? 'Update the interview date, time, and meeting details.'
                            : 'Select a candidate and set interview details. They will be notified by email.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isReschedule && (
                        <>
                            {showJobSelect ? (
                                <FormField label="Job" htmlFor="schedule_job" error={errors.application_uuid} required>
                                    <Select
                                        value={form.jobUuid}
                                        onValueChange={(value) => {
                                            updateField('jobUuid', value);
                                            updateField('applicationUuid', '');
                                        }}
                                    >
                                        <SelectTrigger id="schedule_job">
                                            <SelectValue placeholder="Select a job" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[100]">
                                            {jobs.map((job) => (
                                                <SelectItem key={job.uuid} value={job.uuid}>
                                                    {job.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            ) : (
                                selectedJob && (
                                    <FormField label="Job" htmlFor="schedule_job">
                                        <Input id="schedule_job" value={selectedJob.title} readOnly disabled />
                                    </FormField>
                                )
                            )}

                            <FormField
                                label="Candidate"
                                htmlFor="schedule_candidate"
                                error={errors.application_uuid}
                                required
                                hint={
                                    form.jobUuid && !isLoadingApplicants && applicants.length === 0
                                        ? 'No applicants for this job yet.'
                                        : undefined
                                }
                            >
                                <Select
                                    value={form.applicationUuid}
                                    onValueChange={(value) => updateField('applicationUuid', value)}
                                    disabled={!form.jobUuid || isLoadingApplicants}
                                >
                                    <SelectTrigger id="schedule_candidate">
                                        <SelectValue
                                            placeholder={
                                                !form.jobUuid
                                                    ? 'Select a job first'
                                                    : isLoadingApplicants
                                                      ? 'Loading candidates...'
                                                      : applicants.length === 0
                                                        ? 'No applicants yet'
                                                        : 'Select a candidate'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="z-[100]">
                                        {applicants.map((application) => (
                                            <SelectItem key={application.uuid} value={application.uuid}>
                                                {getApplicantLabel(application)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label="Interview type" htmlFor="schedule_type" error={errors.interview_type} required>
                                <Select
                                    value={form.interviewType}
                                    onValueChange={(value) => updateField('interviewType', value as InterviewType)}
                                >
                                    <SelectTrigger id="schedule_type">
                                        <SelectValue placeholder="Select interview type" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[100]">
                                        {INTERVIEW_TYPE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Date" htmlFor="schedule_date" error={errors.scheduled_at} required>
                            <Input
                                id="schedule_date"
                                type="date"
                                value={form.date}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => updateField('date', e.target.value)}
                                required
                            />
                        </FormField>
                        <FormField label="Time" htmlFor="schedule_time" error={errors.scheduled_at} required>
                            <Input
                                id="schedule_time"
                                type="time"
                                value={form.time}
                                onChange={(e) => updateField('time', e.target.value)}
                                required
                            />
                        </FormField>
                    </div>

                    <FormField label="Timezone" htmlFor="schedule_timezone" error={errors.timezone} required>
                        <Select value={form.timezone} onValueChange={(value) => updateField('timezone', value)}>
                            <SelectTrigger id="schedule_timezone">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[100]">
                                {COMMON_TIMEZONES.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tz}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField label="Duration (minutes)" htmlFor="schedule_duration" error={errors.duration_minutes}>
                        <Input
                            id="schedule_duration"
                            type="number"
                            min={15}
                            max={480}
                            value={form.durationMinutes}
                            onChange={(e) => updateField('durationMinutes', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Meeting link" htmlFor="schedule_meeting_link" error={errors.meeting_link}>
                        <Input
                            id="schedule_meeting_link"
                            type="url"
                            placeholder="https://..."
                            value={form.meetingLink}
                            onChange={(e) => updateField('meetingLink', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Interview notes" htmlFor="schedule_notes" error={errors.instructions}>
                        <Textarea
                            id="schedule_notes"
                            rows={3}
                            value={form.instructions}
                            onChange={(e) => updateField('instructions', e.target.value)}
                            placeholder="Instructions or notes for the candidate"
                        />
                    </FormField>

                    {!isReschedule && (
                        <FormField label="Title (optional)" htmlFor="schedule_title" error={errors.title}>
                            <Input
                                id="schedule_title"
                                value={form.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="Defaults to job title"
                            />
                        </FormField>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                mutation.isPending ||
                                (!isReschedule && (!form.applicationUuid || !form.jobUuid))
                            }
                        >
                            {mutation.isPending
                                ? 'Saving...'
                                : isReschedule
                                  ? 'Save changes'
                                  : 'Schedule interview'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
