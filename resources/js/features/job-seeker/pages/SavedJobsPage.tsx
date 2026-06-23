import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Bookmark, Building2, MapPin, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatSalary, titleCase } from '@/lib/utils';
import type { Job } from '@/types/models';

export function SavedJobsPage() {
    const [page, setPage] = useState(1);
    const [removeUuid, setRemoveUuid] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['job-seeker', 'saved-jobs', page],
        queryFn: () => jobSeekerApi.savedJobs.list({ page, per_page: DEFAULT_PAGE_SIZE }),
    });

    const removeMutation = useMutation({
        mutationFn: jobSeekerApi.savedJobs.remove,
        onSuccess: () => {
            toast.success('Job removed from saved list');
            setRemoveUuid(null);
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'saved-jobs'] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to remove job')),
    });

    const jobs = data?.data ?? [];
    const meta = data?.meta?.pagination;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Saved jobs"
                description="Jobs you've bookmarked for later review."
            />

            {isLoading ? (
                <LoadingSpinner label="Loading saved jobs..." />
            ) : isError ? (
                <ErrorState title="Unable to load saved jobs" onRetry={() => refetch()} />
            ) : jobs.length === 0 ? (
                <EmptyState
                    icon={<Bookmark className="h-6 w-6 text-muted-foreground" />}
                    title="No saved jobs"
                    description="Save jobs while browsing to keep track of opportunities you're interested in."
                    action={{ label: 'Browse jobs', onClick: () => { window.location.href = '/job-seeker/jobs'; } }}
                />
            ) : (
                <>
                    <div className="space-y-3">
                        {jobs.map((job: Job) => {
                            const location = [job.location_city, job.location_state].filter(Boolean).join(', ');
                            return (
                                <Card key={job.uuid} className="transition-all hover:shadow-md">
                                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-2">
                                            <Link
                                                to={`/job-seeker/jobs/${job.uuid}`}
                                                className="text-lg font-semibold hover:text-primary"
                                            >
                                                {job.title}
                                            </Link>
                                            {job.company && (
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Building2 className="h-3.5 w-3.5" />
                                                    {job.company.name}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="secondary">{titleCase(job.work_mode)}</Badge>
                                                <Badge variant="outline">{titleCase(job.employment_type)}</Badge>
                                                {location && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {location}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-primary">
                                                {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.is_salary_visible)}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link to={`/job-seeker/jobs/${job.uuid}`}>View</Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setRemoveUuid(job.uuid)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    {meta && <Pagination meta={meta} onPageChange={setPage} />}
                </>
            )}

            <ConfirmDialog
                open={!!removeUuid}
                onOpenChange={(open) => !open && setRemoveUuid(null)}
                title="Remove saved job?"
                description="This job will be removed from your saved list."
                confirmLabel="Remove"
                variant="destructive"
                isLoading={removeMutation.isPending}
                onConfirm={() => removeUuid && removeMutation.mutate(removeUuid)}
            />
        </div>
    );
}
