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
import { TableCard } from '@/components/common/TableCard';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/features/admin/api/admin-api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 15;

interface AdminCompany {
    uuid: string;
    name: string;
    industry?: string | null;
    company_size?: string | null;
    headquarters?: string | null;
    verification_status: string;
    jobs_count?: number;
    created_at?: string | null;
}

export function AdminCompaniesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'companies', page, debouncedSearch],
        queryFn: () =>
            adminApi.companies({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
                include: 'jobs',
            }) as Promise<ApiResponse<AdminCompany[]>>,
    });

    const columns = useMemo<ColumnDef<AdminCompany>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Company',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.name}</p>
                        {row.original.headquarters && (
                            <p className="text-xs text-muted-foreground">{row.original.headquarters}</p>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'industry',
                header: 'Industry',
                cell: ({ row }) => row.original.industry ?? '—',
            },
            {
                accessorKey: 'company_size',
                header: 'Size',
                cell: ({ row }) => row.original.company_size ?? '—',
            },
            {
                accessorKey: 'verification_status',
                header: 'Verification',
                cell: ({ row }) => <StatusBadge status={row.original.verification_status} />,
            },
            {
                accessorKey: 'jobs_count',
                header: 'Jobs',
                cell: ({ row }) => row.original.jobs_count?.toLocaleString() ?? '0',
            },
            {
                accessorKey: 'created_at',
                header: 'Joined',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">{formatDate(row.original.created_at)}</span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/companies/${row.original.uuid}`}>View</Link>
                    </Button>
                ),
            },
        ],
        [],
    );

    const companies = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load companies"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Companies"
                description="Browse registered employer companies and view their full profiles."
                breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Companies' }]}
            />

            <TableCard
                toolbar={
                    <SearchInput
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder="Search companies..."
                        className="w-full sm:max-w-sm"
                    />
                }
                footer={pagination ? <Pagination meta={pagination} onPageChange={setPage} /> : undefined}
            >
                <DataTable
                    columns={columns}
                    data={companies}
                    isLoading={isLoading}
                    emptyTitle="No companies found"
                    emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : undefined}
                    variant="embedded"
                />
            </TableCard>
        </div>
    );
}
