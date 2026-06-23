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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminApi } from '@/features/admin/api/admin-api';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const PER_PAGE = 15;

interface AdminVerification {
    id: number;
    status: string;
    business_registration_number?: string | null;
    notes?: string | null;
    company?: { uuid: string; name: string } | null;
    submitter?: { full_name: string; email: string } | null;
    created_at?: string | null;
}

export function AdminVerificationsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [rejectTarget, setRejectTarget] = useState<AdminVerification | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const debouncedSearch = useDebounce(search);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'verifications', page, debouncedSearch],
        queryFn: () =>
            adminApi.verifications({
                page,
                per_page: PER_PAGE,
                search: debouncedSearch || undefined,
            }) as Promise<ApiResponse<AdminVerification[]>>,
    });

    const reviewMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
            adminApi.reviewVerification(id, payload),
        onSuccess: () => {
            toast.success('Verification reviewed');
            queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
            setRejectTarget(null);
            setRejectionReason('');
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to review verification')),
    });

    const columns = useMemo<ColumnDef<AdminVerification>[]>(
        () => [
            {
                accessorKey: 'company',
                header: 'Company',
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium">{row.original.company?.name ?? '—'}</p>
                        {row.original.business_registration_number && (
                            <p className="text-xs text-muted-foreground">
                                Reg: {row.original.business_registration_number}
                            </p>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'submitter',
                header: 'Submitted by',
                cell: ({ row }) => (
                    <div className="text-sm">
                        <p>{row.original.submitter?.full_name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{row.original.submitter?.email}</p>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'created_at',
                header: 'Submitted',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                        {formatDateTime(row.original.created_at)}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const verification = row.original;
                    const canReview = ['pending', 'under_review'].includes(verification.status);

                    if (!canReview) {
                        return <span className="text-sm text-muted-foreground">—</span>;
                    }

                    return (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                disabled={reviewMutation.isPending}
                                onClick={() =>
                                    reviewMutation.mutate({
                                        id: verification.id,
                                        payload: { status: 'approved' },
                                    })
                                }
                            >
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                disabled={reviewMutation.isPending}
                                onClick={() => {
                                    setRejectTarget(verification);
                                    setRejectionReason('');
                                }}
                            >
                                Reject
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [reviewMutation.isPending],
    );

    const verifications = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load verifications"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Verifications"
                description="Review and approve company verification requests."
            />

            <SearchInput
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                placeholder="Search verifications..."
                className="max-w-md"
            />

            <DataTable
                columns={columns}
                data={verifications}
                isLoading={isLoading}
                emptyTitle="No verifications in queue"
                emptyDescription={debouncedSearch ? 'Try adjusting your search terms.' : 'All caught up!'}
            />

            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}

            {rejectTarget && (
                <Dialog
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setRejectTarget(null);
                            setRejectionReason('');
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject verification</DialogTitle>
                            <DialogDescription>
                                Provide a reason for rejecting {rejectTarget.company?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="rejection-reason">Reason</Label>
                            <Textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why this verification is being rejected..."
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setRejectionReason('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={reviewMutation.isPending || !rejectionReason.trim()}
                                onClick={() =>
                                    reviewMutation.mutate({
                                        id: rejectTarget.id,
                                        payload: {
                                            status: 'rejected',
                                            rejection_reason: rejectionReason.trim(),
                                        },
                                    })
                                }
                            >
                                Reject
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
