import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/features/admin/api/admin-api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 15;

interface AdminJob {
    uuid: string;
    title: string;
    status: string;
    employment_type?: string;
    work_mode?: string;
    location_city?: string | null;
    applications_count?: number;
    views_count?: number;
    company?: { uuid: string; name: string } | null;
    created_at?: string | null;
}

export function AdminJobsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'jobs', page, debouncedSearch],
        queryFn: () =>
            adminApi.jobs({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
            }) as Promise<ApiResponse<AdminJob[]>>,
    });

    const columns = useMemo<ColumnDef<AdminJob>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Job',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.title}</p>
                        <p className="text-xs text-muted-foreground">{row.original.company?.name ?? '—'}</p>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            {
                id: 'location',
                header: 'Location',
                cell: ({ row }) => {
                    const parts = [row.original.location_city, row.original.work_mode].filter(Boolean);
                    return parts.length ? parts.join(' · ') : '—';
                },
            },
            {
                accessorKey: 'applications_count',
                header: 'Applications',
                cell: ({ row }) => row.original.applications_count?.toLocaleString() ?? '0',
            },
            {
                accessorKey: 'created_at',
                header: 'Posted',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">{formatDate(row.original.created_at)}</span>
                ),
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={`/jobs/${row.original.uuid}`}>View</Link>
                    </Button>
                ),
            },
        ],
        [],
    );

    const jobs = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load jobs"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Jobs"
                description="Monitor all job postings across the platform."
            />

            <SearchInput
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                placeholder="Search jobs..."
                className="max-w-md"
            />

            <DataTable
                columns={columns}
                data={jobs}
                isLoading={isLoading}
                emptyTitle="No jobs found"
                emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : undefined}
            />

            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
        </div>
    );
}
