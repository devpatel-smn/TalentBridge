import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { adminApi } from '@/features/admin/api/admin-api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateTime } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 15;

interface AdminInterview {
    uuid: string;
    title: string;
    interview_type: string;
    status: string;
    scheduled_at: string;
    duration_minutes?: number;
    company?: { uuid: string; name: string } | null;
    job_application?: {
        candidate?: { user?: { full_name: string } } | null;
        job?: { title: string } | null;
    } | null;
}

export function AdminInterviewsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'interviews', page, debouncedSearch],
        queryFn: () =>
            adminApi.interviews({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
            }) as Promise<ApiResponse<AdminInterview[]>>,
    });

    const columns = useMemo<ColumnDef<AdminInterview>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Interview',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.title}</p>
                        <p className="text-xs text-muted-foreground">
                            {row.original.job_application?.job?.title ?? row.original.interview_type}
                        </p>
                    </div>
                ),
            },
            {
                accessorKey: 'company',
                header: 'Company',
                cell: ({ row }) => row.original.company?.name ?? '—',
            },
            {
                id: 'candidate',
                header: 'Candidate',
                cell: ({ row }) =>
                    row.original.job_application?.candidate?.user?.full_name ?? '—',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'scheduled_at',
                header: 'Scheduled',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {formatDateTime(row.original.scheduled_at)}
                    </span>
                ),
            },
            {
                accessorKey: 'duration_minutes',
                header: 'Duration',
                cell: ({ row }) =>
                    row.original.duration_minutes ? `${row.original.duration_minutes} min` : '—',
            },
        ],
        [],
    );

    const interviews = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load interviews"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Interviews"
                description="Monitor scheduled and completed interviews across the platform."
            />

            <SearchInput
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                placeholder="Search interviews..."
                className="max-w-md"
            />

            <DataTable
                columns={columns}
                data={interviews}
                isLoading={isLoading}
                emptyTitle="No interviews found"
                emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : undefined}
            />

            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
        </div>
    );
}
