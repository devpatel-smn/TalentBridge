import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableCard } from '@/components/common/TableCard';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/features/admin/api/admin-api';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 15;

interface JobSeekerListItem {
    uuid: string;
    headline?: string | null;
    current_title?: string | null;
    profile_completion?: number;
    user?: {
        id: number;
        full_name: string;
        email: string;
        status: string;
        last_login_at?: string | null;
    };
}

export function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'job-seekers', page, debouncedSearch],
        queryFn: () =>
            adminApi.jobSeekers({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
            }) as Promise<ApiResponse<JobSeekerListItem[]>>,
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.updateUserStatus(id, status),
        onSuccess: () => {
            toast.success('Job seeker status updated');
            queryClient.invalidateQueries({ queryKey: ['admin', 'job-seekers'] });
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update job seeker status')),
    });

    const columns = useMemo<ColumnDef<JobSeekerListItem>[]>(
        () => [
            {
                accessorKey: 'user',
                header: 'Name',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium text-foreground">{row.original.user?.full_name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{row.original.user?.email}</p>
                    </div>
                ),
            },
            {
                accessorKey: 'current_title',
                header: 'Title',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {row.original.current_title ?? row.original.headline ?? '—'}
                    </span>
                ),
            },
            {
                accessorKey: 'profile_completion',
                header: 'Profile',
                cell: ({ row }) => (
                    <span className="text-sm tabular-nums text-muted-foreground">
                        {row.original.profile_completion ?? 0}%
                    </span>
                ),
            },
            {
                id: 'status',
                header: 'Status',
                cell: ({ row }) =>
                    row.original.user?.status ? <StatusBadge status={row.original.user.status} /> : '—',
            },
            {
                id: 'last_login_at',
                header: 'Last login',
                cell: ({ row }) => (
                    <span className="text-sm tabular-nums text-muted-foreground">
                        {formatDateTime(row.original.user?.last_login_at)}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const seeker = row.original;
                    const user = seeker.user;
                    if (!user) return null;

                    const isActive = user.status === 'active';
                    const isSuspended = user.status === 'suspended';

                    return (
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" asChild>
                                <Link to={`/admin/users/${seeker.uuid}`}>View</Link>
                            </Button>
                            {isSuspended || user.status === 'inactive' ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={statusMutation.isPending}
                                    onClick={() => statusMutation.mutate({ id: user.id, status: 'active' })}
                                >
                                    Activate
                                </Button>
                            ) : null}
                            {isActive ? (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={statusMutation.isPending}
                                    onClick={() => statusMutation.mutate({ id: user.id, status: 'suspended' })}
                                >
                                    Suspend
                                </Button>
                            ) : null}
                        </div>
                    );
                },
            },
        ],
        [statusMutation.isPending],
    );

    const jobSeekers = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load job seekers"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Users"
                description="Manage job seeker accounts and view their full profiles."
                breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}
            />

            <TableCard
                toolbar={
                    <SearchInput
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder="Search job seekers..."
                        className="w-full sm:max-w-sm"
                    />
                }
                footer={pagination ? <Pagination meta={pagination} onPageChange={setPage} /> : undefined}
            >
                <DataTable
                    columns={columns}
                    data={jobSeekers}
                    isLoading={isLoading}
                    emptyTitle="No job seekers found"
                    emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : undefined}
                    variant="embedded"
                />
            </TableCard>
        </div>
    );
}
