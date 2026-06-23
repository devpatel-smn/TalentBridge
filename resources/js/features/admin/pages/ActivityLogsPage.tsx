import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { adminApi } from '@/features/admin/api/admin-api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateTime, titleCase } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 20;

interface ActivityLog {
    id: number;
    activity_type: string;
    description: string;
    subject_type?: string | null;
    user?: { full_name: string; email: string } | null;
    company?: { name: string } | null;
    created_at: string;
}

export function AdminActivityLogsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'activity-logs', page, debouncedSearch],
        queryFn: () =>
            adminApi.activityLogs({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
            }) as Promise<ApiResponse<ActivityLog[]>>,
    });

    const columns = useMemo<ColumnDef<ActivityLog>[]>(
        () => [
            {
                accessorKey: 'activity_type',
                header: 'Type',
                cell: ({ row }) => (
                    <span className="text-sm font-medium">{titleCase(row.original.activity_type)}</span>
                ),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: ({ row }) => (
                    <span className="max-w-md text-sm text-muted-foreground line-clamp-2">
                        {row.original.description}
                    </span>
                ),
            },
            {
                accessorKey: 'user',
                header: 'User',
                cell: ({ row }) => (
                    <div className="text-sm">
                        <p>{row.original.user?.full_name ?? '—'}</p>
                        {row.original.user?.email && (
                            <p className="text-xs text-muted-foreground">{row.original.user.email}</p>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'company',
                header: 'Company',
                cell: ({ row }) => row.original.company?.name ?? '—',
            },
            {
                accessorKey: 'created_at',
                header: 'When',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {formatDateTime(row.original.created_at)}
                    </span>
                ),
            },
        ],
        [],
    );

    const logs = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load activity logs"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Activity Logs"
                description="Audit trail of platform activity and user actions."
            />

            <SearchInput
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                placeholder="Search activity logs..."
                className="max-w-md"
            />

            <DataTable
                columns={columns}
                data={logs}
                isLoading={isLoading}
                emptyTitle="No activity logs found"
                emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : undefined}
            />

            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
        </div>
    );
}
