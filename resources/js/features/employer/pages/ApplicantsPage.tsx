import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { employerApi } from '@/features/employer/api/employer-api';
import { ScheduleInterviewDialog } from '@/features/employer/components/ScheduleInterviewDialog';
import { SCHEDULABLE_APPLICATION_STATUSES } from '@/features/interviews/lib/interview-utils';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import type { Job, JobApplication } from '@/types/models';

export function ApplicantsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedJobUuid, setSelectedJobUuid] = useState(searchParams.get('job') ?? '');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [scheduleApplicationUuid, setScheduleApplicationUuid] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search);

    const {
        data: jobsResponse,
        isLoading: isLoadingJobs,
        isError: isJobsError,
        error: jobsError,
        refetch: refetchJobs,
    } = useQuery({
        queryKey: ['employer', 'jobs', 'filter-list'],
        queryFn: () => employerApi.jobs.list({ per_page: 100 }),
    });

    const jobs = (jobsResponse?.data ?? []) as Job[];

    useEffect(() => {
        if (!selectedJobUuid && jobs.length > 0) {
            setSelectedJobUuid(jobs[0].uuid);
        }
    }, [jobs, selectedJobUuid]);

    useEffect(() => {
        if (selectedJobUuid) {
            setSearchParams({ job: selectedJobUuid }, { replace: true });
        }
    }, [selectedJobUuid, setSearchParams]);

    const {
        data: applicantsResponse,
        isLoading: isLoadingApplicants,
        isError: isApplicantsError,
        error: applicantsError,
        refetch: refetchApplicants,
    } = useQuery({
        queryKey: ['employer', 'applicants', selectedJobUuid, { page, search: debouncedSearch }],
        queryFn: () =>
            employerApi.applicants.list(selectedJobUuid, {
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
            }),
        enabled: Boolean(selectedJobUuid),
    });

    const applicants = (applicantsResponse?.data ?? []) as JobApplication[];
    const pagination = applicantsResponse?.meta?.pagination;

    const columns: ColumnDef<JobApplication>[] = [
        {
            accessorKey: 'applicant',
            header: 'Applicant',
            cell: ({ row }) => {
                const profile = row.original.job_seeker_profile;
                const name = profile?.user?.full_name ?? 'Unknown';
                const email = profile?.user?.email ?? '';
                return (
                    <div>
                        <p className="font-medium">{name}</p>
                        {email && <p className="text-xs text-muted-foreground">{email}</p>}
                        {profile?.headline && (
                            <p className="text-xs text-muted-foreground">{profile.headline}</p>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            accessorKey: 'applied_at',
            header: 'Applied',
            cell: ({ row }) => formatDateTime(row.original.applied_at),
        },
        {
            accessorKey: 'resume',
            header: 'Resume',
            cell: ({ row }) => row.original.resume?.title ?? '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                const canSchedule = SCHEDULABLE_APPLICATION_STATUSES.includes(
                    row.original.status as (typeof SCHEDULABLE_APPLICATION_STATUSES)[number],
                );

                if (!canSchedule) return null;

                return (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScheduleApplicationUuid(row.original.uuid)}
                    >
                        <Video className="mr-1.5 h-4 w-4" />
                        Schedule
                    </Button>
                );
            },
        },
    ];

    if (isLoadingJobs) {
        return <LoadingSpinner label="Loading jobs..." />;
    }

    if (isJobsError) {
        return (
            <ErrorState
                title="Failed to load jobs"
                description={getApiErrorMessage(jobsError)}
                onRetry={() => refetchJobs()}
            />
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="space-y-6">
                <PageHeader title="Applicants" description="Review candidates for your job postings" />
                <EmptyState
                    title="No jobs available"
                    description="Create a job posting first to start receiving applications."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Applicants" description="Review candidates for your job postings" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2 sm:w-72">
                    <Label>Filter by job</Label>
                    <Select value={selectedJobUuid} onValueChange={(value) => {
                        setSelectedJobUuid(value);
                        setPage(1);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a job" />
                        </SelectTrigger>
                        <SelectContent>
                            {jobs.map((job) => (
                                <SelectItem key={job.uuid} value={job.uuid}>
                                    {job.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <SearchInput
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    placeholder="Search applicants..."
                    className="sm:max-w-sm"
                />
            </div>

            {isApplicantsError ? (
                <ErrorState
                    title="Failed to load applicants"
                    description={getApiErrorMessage(applicantsError)}
                    onRetry={() => refetchApplicants()}
                />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={applicants}
                        isLoading={isLoadingApplicants}
                        emptyTitle="No applicants yet"
                        emptyDescription="Applications for this job will appear here."
                    />
                    {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
                </>
            )}

            <ScheduleInterviewDialog
                open={Boolean(scheduleApplicationUuid)}
                onOpenChange={(open) => {
                    if (!open) setScheduleApplicationUuid(null);
                }}
                defaultApplicationUuid={scheduleApplicationUuid ?? undefined}
                defaultJobUuid={selectedJobUuid}
                onSuccess={() => {
                    setScheduleApplicationUuid(null);
                }}
            />
        </div>
    );
}
