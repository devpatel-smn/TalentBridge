import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/features/admin/api/admin-api';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 15;

interface AdminUser {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    status: string;
    roles?: string[];
    last_login_at?: string | null;
    created_at?: string | null;
}

export function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'users', page, debouncedSearch],
        queryFn: () =>
            adminApi.users({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
            }) as Promise<ApiResponse<AdminUser[]>>,
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.updateUserStatus(id, status),
        onSuccess: () => {
            toast.success('User status updated');
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update user status')),
    });

    const columns = useMemo<ColumnDef<AdminUser>[]>(
        () => [
            {
                accessorKey: 'full_name',
                header: 'Name',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.full_name}</p>
                        <p className="text-xs text-muted-foreground">{row.original.email}</p>
                    </div>
                ),
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {row.original.roles?.join(', ') ?? '—'}
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'last_login_at',
                header: 'Last login',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {formatDateTime(row.original.last_login_at)}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const user = row.original;
                    const isActive = user.status === 'active';
                    const isSuspended = user.status === 'suspended';

                    return (
                        <div className="flex gap-2">
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

    const users = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load users"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Users"
                description="Manage platform users, roles, and account status."
            />

            <SearchInput
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                placeholder="Search by name or email..."
                className="max-w-md"
            />

            <DataTable
                columns={columns}
                data={users}
                isLoading={isLoading}
                emptyTitle="No users found"
                emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : undefined}
            />

            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
        </div>
    );
}
