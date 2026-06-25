import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { AdminFormDialog, type AdminAccount } from '@/features/admin/components/AdminFormDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { ROLES } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 15;

interface AdminListUser extends AdminAccount {
    uuid: string;
    full_name: string;
    last_login_at?: string | null;
    created_at?: string | null;
}

export function AdminAdminsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminListUser | null>(null);
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'admins', page, debouncedSearch],
        queryFn: () =>
            adminApi.users({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
                filter: { role: ROLES.ADMIN },
            }) as Promise<ApiResponse<AdminListUser[]>>,
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.updateUserStatus(id, status),
        onSuccess: () => {
            toast.success('Admin status updated');
            queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] });
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update admin status')),
    });

    const openCreate = () => {
        setEditingAdmin(null);
        setDialogOpen(true);
    };

    const openEdit = (admin: AdminListUser) => {
        setEditingAdmin(admin);
        setDialogOpen(true);
    };

    const columns = useMemo<ColumnDef<AdminListUser>[]>(
        () => [
            {
                accessorKey: 'full_name',
                header: 'Name',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium text-foreground">{row.original.full_name}</p>
                        <p className="text-xs text-muted-foreground">{row.original.email}</p>
                    </div>
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
                    <span className="text-sm tabular-nums text-muted-foreground">
                        {formatDateTime(row.original.last_login_at)}
                    </span>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Created',
                cell: ({ row }) => (
                    <span className="text-sm tabular-nums text-muted-foreground">
                        {formatDateTime(row.original.created_at)}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const admin = row.original;
                    const isActive = admin.status === 'active';

                    return (
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEdit(admin)}>
                                Edit
                            </Button>
                            {isActive ? (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={statusMutation.isPending}
                                    onClick={() => statusMutation.mutate({ id: admin.id, status: 'inactive' })}
                                >
                                    Deactivate
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={statusMutation.isPending}
                                    onClick={() => statusMutation.mutate({ id: admin.id, status: 'active' })}
                                >
                                    Activate
                                </Button>
                            )}
                        </div>
                    );
                },
            },
        ],
        [statusMutation.isPending],
    );

    const admins = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load admins"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admins"
                description="Create and manage platform administrators. Inactive admins cannot sign in."
                breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Admins' }]}
                actions={
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        New admin
                    </Button>
                }
            />

            <TableCard
                toolbar={
                    <SearchInput
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder="Search by name or email..."
                        className="w-full sm:max-w-sm"
                    />
                }
                footer={pagination ? <Pagination meta={pagination} onPageChange={setPage} /> : undefined}
            >
                <DataTable
                    columns={columns}
                    data={admins}
                    isLoading={isLoading}
                    emptyTitle="No admins found"
                    emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : undefined}
                    variant="embedded"
                />
            </TableCard>

            <AdminFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                admin={editingAdmin}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] })}
            />
        </div>
    );
}
