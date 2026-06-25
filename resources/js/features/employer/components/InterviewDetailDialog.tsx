import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Building2,
    Calendar,
    Clock,
    ExternalLink,
    MapPin,
    User,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { employerApi } from '@/features/employer/api/employer-api';
import { ScheduleInterviewDialog } from '@/features/employer/components/ScheduleInterviewDialog';
import {
    canEmployerManage,
    getCandidateName,
} from '@/features/interviews/lib/interview-utils';
import { getApiErrorMessage } from '@/lib/api-client';
import { formatDateTime, titleCase } from '@/lib/utils';
import type { Interview } from '@/types/models';

interface InterviewDetailDialogProps {
    interview: Interview | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: () => void;
}

export function InterviewDetailDialog({
    interview,
    open,
    onOpenChange,
    onUpdated,
}: InterviewDetailDialogProps) {
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);

    const cancelMutation = useMutation({
        mutationFn: () => employerApi.interviews.cancel(interview!.uuid),
        onSuccess: () => {
            toast.success('Interview cancelled');
            setCancelOpen(false);
            onUpdated();
            onOpenChange(false);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to cancel interview')),
    });

    if (!interview) return null;

    const manageable = canEmployerManage(interview);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {interview.title ?? interview.job_application?.job?.title ?? 'Interview details'}
                        </DialogTitle>
                        <DialogDescription>Review interview information and manage the session.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={interview.status} />
                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                {titleCase(interview.interview_type)}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4 shrink-0" />
                                <span>{getCandidateName(interview)}</span>
                            </div>
                            {interview.company?.name && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Building2 className="h-4 w-4 shrink-0" />
                                    <span>{interview.company.name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span>{formatDateTime(interview.scheduled_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 shrink-0" />
                                <span>
                                    {interview.duration_minutes} min · {interview.timezone}
                                </span>
                            </div>
                            {interview.location && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span>{interview.location}</span>
                                </div>
                            )}
                        </div>

                        {interview.instructions && (
                            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
                                <p className="mb-1 font-medium">Notes</p>
                                <p className="text-muted-foreground">{interview.instructions}</p>
                            </div>
                        )}

                        {interview.meeting_link && (
                            <a
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                                Open meeting link
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        )}

                        {interview.cancellation_reason && (
                            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                                <p className="mb-1 font-medium text-destructive">Cancellation reason</p>
                                <p className="text-muted-foreground">{interview.cancellation_reason}</p>
                            </div>
                        )}

                        {manageable && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button size="sm" onClick={() => setRescheduleOpen(true)}>
                                    Reschedule
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setCancelOpen(true)}>
                                    Cancel interview
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ScheduleInterviewDialog
                open={rescheduleOpen}
                onOpenChange={setRescheduleOpen}
                interview={interview}
                onSuccess={onUpdated}
            />

            <ConfirmDialog
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                title="Cancel interview?"
                description="The candidate and your team will be notified by email."
                confirmLabel="Cancel interview"
                variant="destructive"
                isLoading={cancelMutation.isPending}
                onConfirm={() => cancelMutation.mutate()}
            />
        </>
    );
}
