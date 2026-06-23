import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, FileText, Send } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export function JobSeekerApplicationsPage() {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['job-seeker', 'applications', page],
        queryFn: () => jobSeekerApi.applications.list({ page, per_page: DEFAULT_PAGE_SIZE }),
    });

    const applications = data?.data ?? [];
    const meta = data?.meta?.pagination;

    return (
        <div className="space-y-6">
            <PageHeader
                title="My applications"
                description="Track the status of every job you've applied to."
                actions={
                    <Link
                        to="/job-seeker/jobs"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Browse jobs
                    </Link>
                }
            />

            {isLoading ? (
                <LoadingSpinner label="Loading applications..." />
            ) : isError ? (
                <ErrorState title="Unable to load applications" onRetry={() => refetch()} />
            ) : applications.length === 0 ? (
                <EmptyState
                    icon={<Send className="h-6 w-6 text-muted-foreground" />}
                    title="No applications yet"
                    description="Start applying to jobs and track your progress here."
                    action={{ label: 'Find jobs', onClick: () => { window.location.href = '/job-seeker/jobs'; } }}
                />
            ) : (
                <>
                    <div className="space-y-3">
                        {applications.map((app) => (
                            <Card key={app.uuid} className="transition-all hover:shadow-md">
                                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Link
                                                to={`/job-seeker/jobs/${app.job?.uuid}`}
                                                className="text-lg font-semibold hover:text-primary"
                                            >
                                                {app.job?.title ?? 'Unknown position'}
                                            </Link>
                                            <StatusBadge status={app.status} />
                                        </div>
                                        {app.job?.company && (
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Building2 className="h-3.5 w-3.5" />
                                                {app.job.company.name}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                            <span>Applied {formatDate(app.applied_at)}</span>
                                            {app.status_changed_at && (
                                                <span>Updated {formatDate(app.status_changed_at)}</span>
                                            )}
                                            {app.resume && (
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {app.resume.title}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {app.job?.uuid && (
                                        <Link
                                            to={`/job-seeker/jobs/${app.job.uuid}`}
                                            className="shrink-0 text-sm font-medium text-primary hover:underline"
                                        >
                                            View job →
                                        </Link>
                                    )}
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
