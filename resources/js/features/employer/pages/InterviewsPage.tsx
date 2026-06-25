import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employerApi } from '@/features/employer/api/employer-api';
import { InterviewDetailDialog } from '@/features/employer/components/InterviewDetailDialog';
import { ScheduleInterviewDialog } from '@/features/employer/components/ScheduleInterviewDialog';
import { getCandidateName } from '@/features/interviews/lib/interview-utils';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDateTime, titleCase } from '@/lib/utils';
import type { Interview, InterviewStatus } from '@/types/models';

type InterviewTab = 'upcoming' | 'scheduled' | 'completed' | 'cancelled';

const TAB_STATUS: Record<InterviewTab, InterviewStatus | undefined> = {
    upcoming: undefined,
    scheduled: 'scheduled',
    completed: 'completed',
    cancelled: 'cancelled',
};

export function EmployerInterviewsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<InterviewTab>('upcoming');
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const debouncedSearch = useDebounce(search);
    const queryClient = useQueryClient();

    const detailUuid = searchParams.get('uuid');

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'interviews', { page, search: debouncedSearch, tab }],
        queryFn: () => {
            if (tab === 'upcoming') {
                return employerApi.interviews.upcoming({
                    page,
                    per_page: DEFAULT_PAGE_SIZE,
                    search: debouncedSearch || undefined,
                });
            }

            const status = TAB_STATUS[tab];
            return employerApi.interviews.list({
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
                filter: status ? { status } : undefined,
            });
        },
    });

    const { data: detailInterview } = useQuery({
        queryKey: ['employer', 'interviews', detailUuid],
        queryFn: () => employerApi.interviews.get(detailUuid!),
        enabled: Boolean(detailUuid),
    });

    useEffect(() => {
        if (detailInterview) {
            setSelectedInterview(detailInterview);
        }
    }, [detailInterview]);

    const interviews = (data?.data ?? []) as Interview[];
    const pagination = data?.meta?.pagination;

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['employer', 'interviews'] });
        queryClient.invalidateQueries({ queryKey: ['employer', 'dashboard'] });
    };

    const columns: ColumnDef<Interview>[] = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Interview',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.title ?? 'Interview'}</p>
                        <p className="text-xs text-muted-foreground">
                            {titleCase(row.original.interview_type)}
                        </p>
                    </div>
                ),
            },
            {
                accessorKey: 'candidate',
                header: 'Candidate',
                cell: ({ row }) => getCandidateName(row.original),
            },
            {
                accessorKey: 'job',
                header: 'Job',
                cell: ({ row }) => row.original.job_application?.job?.title ?? '—',
            },
            {
                accessorKey: 'scheduled_at',
                header: 'Scheduled',
                cell: ({ row }) => formatDateTime(row.original.scheduled_at),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'duration_minutes',
                header: 'Duration',
                cell: ({ row }) => `${row.original.duration_minutes} min`,
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setSelectedInterview(row.original);
                            setSearchParams({ uuid: row.original.uuid });
                        }}
                    >
                        View
                    </Button>
                ),
            },
        ],
        [setSearchParams],
    );

    if (isError) {
        return (
            <ErrorState
                title="Failed to load interviews"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Interviews"
                description="Schedule, manage, and track candidate interviews"
                actions={
                    <Button className="rounded-xl" onClick={() => setScheduleOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule interview
                    </Button>
                }
            />

            <Tabs
                value={tab}
                onValueChange={(value) => {
                    setTab(value as InterviewTab);
                    setPage(1);
                }}
            >
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value={tab} className="space-y-4">
                    <SearchInput
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder="Search interviews..."
                        className="max-w-sm"
                    />

                    <DataTable
                        columns={columns}
                        data={interviews}
                        isLoading={isLoading}
                        emptyTitle={
                            tab === 'upcoming' ? 'No upcoming interviews' : `No ${tab} interviews`
                        }
                        emptyDescription={
                            tab === 'upcoming'
                                ? 'Schedule interviews with shortlisted candidates to see them here.'
                                : 'Interviews matching this filter will appear here.'
                        }
                    />

                    {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
                </TabsContent>
            </Tabs>

            <ScheduleInterviewDialog
                open={scheduleOpen}
                onOpenChange={setScheduleOpen}
                onSuccess={invalidate}
            />

            <InterviewDetailDialog
                interview={selectedInterview}
                open={Boolean(selectedInterview)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedInterview(null);
                        setSearchParams({});
                    }
                }}
                onUpdated={invalidate}
            />
        </div>
    );
}
