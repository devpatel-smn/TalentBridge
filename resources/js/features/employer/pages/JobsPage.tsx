import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Info, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableCard } from '@/components/common/TableCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { employerApi } from '@/features/employer/api/employer-api';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { Job } from '@/types/models';

export function EmployerJobsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data: company } = useQuery({
        queryKey: ['employer', 'company'],
        queryFn: employerApi.company.get,
    });

    const isCompanyVerified = company?.verification_status === 'approved';

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'jobs', { page, search: debouncedSearch }],
        queryFn: () =>
            employerApi.jobs.list({
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
            }),
    });

    const publishMutation = useMutation({
        mutationFn: employerApi.jobs.publish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['employer', 'dashboard'] });
            toast.success('Job published');
        },
        onError: (err) => {
            const message = getApiErrorMessage(err, 'Failed to publish job');
            if (message.toLowerCase().includes('verified')) {
                toast.error('Company must be verified before publishing jobs.', {
                    action: {
                        label: 'Verify company',
                        onClick: () => navigate('/employer/verification'),
                    },
                });
                return;
            }
            toast.error(message);
        },
    });

    const closeMutation = useMutation({
        mutationFn: employerApi.jobs.close,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['employer', 'dashboard'] });
            toast.success('Job closed');
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to close job')),
    });

    const jobs = (data?.data ?? []) as Job[];
    const pagination = data?.meta?.pagination;
    const isActionPending = publishMutation.isPending || closeMutation.isPending;

    const columns: ColumnDef<Job>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.title}</p>
                    {row.original.location_city && (
                        <p className="text-xs text-muted-foreground">{row.original.location_city}</p>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            accessorKey: 'applications_count',
            header: 'Applicants',
            cell: ({ row }) => row.original.applications_count ?? 0,
        },
        {
            accessorKey: 'published_at',
            header: 'Published',
            cell: ({ row }) => formatDate(row.original.published_at),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                const job = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isActionPending}>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link to={`/employer/jobs/${job.uuid}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            {job.status === 'draft' && (
                                <DropdownMenuItem
                                    disabled={!isCompanyVerified}
                                    onClick={() => isCompanyVerified && publishMutation.mutate(job.uuid)}
                                >
                                    Publish
                                </DropdownMenuItem>
                            )}
                            {job.status === 'published' && (
                                <DropdownMenuItem onClick={() => closeMutation.mutate(job.uuid)}>
                                    Close
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Link to={`/employer/applicants?job=${job.uuid}`}>View applicants</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isError) {
        return (
            <ErrorState
                title="Failed to load jobs"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Jobs"
                description="New jobs are saved as drafts. Publish them from the actions menu when your company is verified."
                breadcrumbs={[{ label: 'Employer', href: '/employer' }, { label: 'Jobs' }]}
                actions={
                    <Button className="rounded-xl" asChild>
                        <Link to="/employer/jobs/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create job
                        </Link>
                    </Button>
                }
            />

            {company && !isCompanyVerified && (
                <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                                <p className="font-medium">Company verification required to publish</p>
                                <p className="text-sm text-muted-foreground">
                                    You can create and edit draft jobs now. Publish them after your company is verified.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={company.verification_status} />
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/employer/verification">Verify company</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <TableCard
                toolbar={
                    <SearchInput
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder="Search jobs..."
                        className="w-full sm:max-w-sm"
                    />
                }
                footer={pagination ? <Pagination meta={pagination} onPageChange={setPage} /> : undefined}
            >
                <DataTable
                    columns={columns}
                    data={jobs}
                    isLoading={isLoading}
                    emptyTitle="No jobs yet"
                    emptyDescription="Create your first job posting to start receiving applications."
                    variant="embedded"
                />
            </TableCard>
        </div>
    );
}
