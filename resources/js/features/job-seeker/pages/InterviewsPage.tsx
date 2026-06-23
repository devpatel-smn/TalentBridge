import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Building2,
    Calendar,
    Check,
    Clock,
    ExternalLink,
    MapPin,
    Video,
    X,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDateTime, titleCase } from '@/lib/utils';
import type { Interview } from '@/types/models';

function canRespond(interview: Interview): boolean {
    return (
        interview.status === 'scheduled' &&
        new Date(interview.scheduled_at) > new Date()
    );
}

export function JobSeekerInterviewsPage() {
    const [page, setPage] = useState(1);
    const [respondingUuid, setRespondingUuid] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['job-seeker', 'interviews', page],
        queryFn: () => jobSeekerApi.interviews.list({ page, per_page: DEFAULT_PAGE_SIZE }),
    });

    const respondMutation = useMutation({
        mutationFn: ({ uuid, response }: { uuid: string; response: 'accepted' | 'declined' }) =>
            jobSeekerApi.interviews.respond(uuid, response),
        onSuccess: (_, { response }) => {
            toast.success(response === 'accepted' ? 'Interview accepted' : 'Interview declined');
            setRespondingUuid(null);
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'interviews'] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to respond')),
    });

    const interviews = data?.data ?? [];
    const meta = data?.meta?.pagination;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Interviews"
                description="View and respond to your scheduled interviews."
            />

            {isLoading ? (
                <LoadingSpinner label="Loading interviews..." />
            ) : isError ? (
                <ErrorState title="Unable to load interviews" onRetry={() => refetch()} />
            ) : interviews.length === 0 ? (
                <EmptyState
                    icon={<Video className="h-6 w-6 text-muted-foreground" />}
                    title="No interviews scheduled"
                    description="When employers schedule interviews for your applications, they'll appear here."
                />
            ) : (
                <>
                    <div className="space-y-4">
                        {interviews.map((interview) => (
                            <Card key={interview.uuid} className="overflow-hidden transition-all hover:shadow-md">
                                <CardContent className="p-0">
                                    <div className="border-l-4 border-l-primary p-5">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold">
                                                        {interview.title ??
                                                            interview.job_application?.job?.title ??
                                                            'Interview'}
                                                    </h3>
                                                    <StatusBadge status={interview.status} />
                                                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                                        {titleCase(interview.interview_type)}
                                                    </span>
                                                </div>

                                                {interview.job_application?.job?.company && (
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                        <Building2 className="h-3.5 w-3.5" />
                                                        {interview.job_application.job.company.name}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDateTime(interview.scheduled_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4" />
                                                        {interview.duration_minutes} min
                                                    </span>
                                                    {interview.location && (
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="h-4 w-4" />
                                                            {interview.location}
                                                        </span>
                                                    )}
                                                </div>

                                                {interview.instructions && (
                                                    <p className="max-w-2xl text-sm text-muted-foreground">
                                                        {interview.instructions}
                                                    </p>
                                                )}

                                                {interview.meeting_link && (
                                                    <a
                                                        href={interview.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                                    >
                                                        Join meeting
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                            </div>

                                            {canRespond(interview) && (
                                                <div className="flex shrink-0 gap-2">
                                                    <Button
                                                        size="sm"
                                                        disabled={respondingUuid === interview.uuid && respondMutation.isPending}
                                                        onClick={() => {
                                                            setRespondingUuid(interview.uuid);
                                                            respondMutation.mutate({ uuid: interview.uuid, response: 'accepted' });
                                                        }}
                                                    >
                                                        <Check className="mr-1.5 h-4 w-4" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={respondingUuid === interview.uuid && respondMutation.isPending}
                                                        onClick={() => {
                                                            setRespondingUuid(interview.uuid);
                                                            respondMutation.mutate({ uuid: interview.uuid, response: 'declined' });
                                                        }}
                                                    >
                                                        <X className="mr-1.5 h-4 w-4" />
                                                        Decline
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {meta && <Pagination meta={meta} onPageChange={setPage} />}
                </>
            )}
        </div>
    );
}
