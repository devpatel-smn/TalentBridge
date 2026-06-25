import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCandidateName } from '@/features/interviews/lib/interview-utils';
import { formatDateTime } from '@/lib/utils';
import type { Interview } from '@/types/models';

interface UpcomingInterviewsWidgetProps {
    title?: string;
    listHref: string;
    queryKey: string[];
    queryFn: () => Promise<{ data?: Interview[] }>;
    onSelect?: (interview: Interview) => void;
}

export function UpcomingInterviewsWidget({
    title = 'Upcoming interviews',
    listHref,
    queryKey,
    queryFn,
    onSelect,
}: UpcomingInterviewsWidgetProps) {
    const { data, isLoading } = useQuery({
        queryKey,
        queryFn,
    });

    const interviews = (data?.data ?? []).slice(0, 5);

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{title}</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl" asChild>
                    <Link to={listHref}>
                        View all
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <LoadingSpinner label="Loading interviews..." />
                ) : interviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming interviews.</p>
                ) : (
                    <div className="space-y-3">
                        {interviews.map((interview) => (
                            <button
                                key={interview.uuid}
                                type="button"
                                onClick={() => onSelect?.(interview)}
                                className="flex w-full items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40"
                            >
                                <div className="min-w-0 space-y-1">
                                    <p className="truncate font-medium">
                                        {interview.title ?? interview.job_application?.job?.title ?? 'Interview'}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDateTime(interview.scheduled_at)}
                                    </p>
                                    {'job_application' in interview && (
                                        <p className="truncate text-xs text-muted-foreground">
                                            {getCandidateName(interview)}
                                        </p>
                                    )}
                                    {interview.company?.name && (
                                        <p className="truncate text-xs text-muted-foreground">{interview.company.name}</p>
                                    )}
                                </div>
                                <StatusBadge status={interview.status} />
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
