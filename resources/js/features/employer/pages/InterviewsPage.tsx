import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { employerApi } from '@/features/employer/api/employer-api';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDateTime, titleCase } from '@/lib/utils';
import type { Interview } from '@/types/models';

export function EmployerInterviewsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'interviews', { page, search: debouncedSearch }],
        queryFn: () =>
            employerApi.interviews.list({
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
            }),
    });

    const interviews = (data?.data ?? []) as Interview[];
    const pagination = data?.meta?.pagination;

    const columns: ColumnDef<Interview>[] = [
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
            cell: ({ row }) =>
                row.original.job_application?.job_seeker_profile?.user?.full_name ?? '—',
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
    ];

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
                description="View and manage scheduled interviews"
            />

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
                emptyTitle="No interviews scheduled"
                emptyDescription="Interviews you schedule with candidates will appear here."
            />

            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
        </div>
    );
}
