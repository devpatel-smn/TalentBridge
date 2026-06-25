import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { UserPlus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableCard } from '@/components/common/TableCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { employerApi } from '@/features/employer/api/employer-api';
import { EditTeamMemberDialog } from '@/features/employer/components/EditTeamMemberDialog';
import { InviteTeamMemberDialog } from '@/features/employer/components/InviteTeamMemberDialog';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import type { TeamMember } from '@/types/models';

export function TeamPage() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const canManage = user?.permissions?.includes('companies.update') ?? false;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);
    const debouncedSearch = useDebounce(search);

    const { data: dashboard } = useQuery({
        queryKey: ['employer', 'dashboard'],
        queryFn: employerApi.dashboard,
    });

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'team', page, debouncedSearch],
        queryFn: () =>
            employerApi.team.list({
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
            }),
    });

    const removeMutation = useMutation({
        mutationFn: (id: number) => employerApi.team.remove(id),
        onSuccess: () => {
            toast.success('Team member removed');
            setRemoveTarget(null);
            invalidateTeam();
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to remove team member')),
    });

    const invalidateTeam = () => {
        queryClient.invalidateQueries({ queryKey: ['employer', 'team'] });
        queryClient.invalidateQueries({ queryKey: ['employer', 'dashboard'] });
    };

    const openEdit = (member: TeamMember) => {
        setEditingMember(member);
        setEditOpen(true);
    };

    const isSelf = (member: TeamMember) => member.user?.uuid === user?.uuid;

    const columns = useMemo<ColumnDef<TeamMember>[]>(
        () => [
            {
                accessorKey: 'user.full_name',
                header: 'Member',
                cell: ({ row }) => {
                    const member = row.original;
                    return (
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-foreground">{member.user?.full_name ?? '—'}</p>
                                {member.is_primary && (
                                    <Badge variant="default" className="text-[10px]">
                                        Primary
                                    </Badge>
                                )}
                                {isSelf(member) && (
                                    <Badge variant="outline" className="text-[10px]">
                                        You
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{member.user?.email ?? '—'}</p>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'job_title',
                header: 'Job title',
                cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">{row.original.job_title ?? '—'}</span>
                ),
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                cell: ({ row }) => {
                    const member = row.original;
                    if (member.invite_pending) {
                        return <StatusBadge status="pending" />;
                    }

                    return <StatusBadge status={member.is_active ? 'active' : 'inactive'} />;
                },
            },
            {
                accessorKey: 'joined_at',
                header: 'Joined',
                cell: ({ row }) => (
                    <span className="text-sm tabular-nums text-muted-foreground">
                        {row.original.invite_pending ? 'Invitation sent' : formatDateTime(row.original.joined_at)}
                    </span>
                ),
            },
            ...(canManage
                ? [
                      {
                          id: 'actions',
                          header: 'Actions',
                          cell: ({ row }: { row: { original: TeamMember } }) => {
                              const member = row.original;
                              const self = isSelf(member);
                              const isPending = member.invite_pending;

                              return (
                                  <div className="flex flex-wrap gap-2">
                                      {!isPending && (
                                          <Button size="sm" variant="outline" onClick={() => openEdit(member)}>
                                              Edit
                                          </Button>
                                      )}
                                      <Button
                                          size="sm"
                                          variant="destructive"
                                          disabled={self || removeMutation.isPending}
                                          onClick={() => setRemoveTarget(member)}
                                      >
                                          {isPending ? 'Cancel invite' : 'Remove'}
                                      </Button>
                                  </div>
                              );
                          },
                      } satisfies ColumnDef<TeamMember>,
                  ]
                : []),
        ],
        [canManage, removeMutation.isPending, user?.uuid],
    );

    const members = data?.data ?? [];
    const pagination = data?.meta?.pagination;
    const activeMembers =
        (dashboard as { team?: { active_members?: number } } | undefined)?.team?.active_members ?? 0;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load team"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Team"
                description="Manage your company's hiring team — invite colleagues and assign roles."
                actions={
                    canManage ? (
                        <Button onClick={() => setInviteOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite member
                        </Button>
                    ) : undefined
                }
            />

            <StatCard
                title="Active team members"
                value={activeMembers}
                icon={<Users className="h-4 w-4" />}
                className="max-w-sm"
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
                    data={members}
                    isLoading={isLoading}
                    emptyTitle="No team members found"
                    emptyDescription={
                        debouncedSearch
                            ? 'Try adjusting your search terms.'
                            : canManage
                              ? 'Invite colleagues to collaborate on hiring.'
                              : undefined
                    }
                    variant="embedded"
                />
            </TableCard>

            {canManage && (
                <>
                    <InviteTeamMemberDialog
                        open={inviteOpen}
                        onOpenChange={setInviteOpen}
                        onSuccess={invalidateTeam}
                    />

                    <EditTeamMemberDialog
                        open={editOpen}
                        onOpenChange={setEditOpen}
                        member={editingMember}
                        isSelf={editingMember ? isSelf(editingMember) : false}
                        onSuccess={invalidateTeam}
                    />

                    <ConfirmDialog
                        open={Boolean(removeTarget)}
                        onOpenChange={(open) => !open && setRemoveTarget(null)}
                        title="Remove team member"
                        description={
                            removeTarget
                                ? removeTarget.invite_pending
                                    ? `Cancel the invitation sent to ${removeTarget.user?.email ?? 'this email'}?`
                                    : `Remove ${removeTarget.user?.full_name ?? 'this member'} from your hiring team? They will lose access to this company's employer workspace.`
                                : undefined
                        }
                        confirmLabel={removeTarget?.invite_pending ? 'Cancel invite' : 'Remove'}
                        variant="destructive"
                        isLoading={removeMutation.isPending}
                        onConfirm={() => removeTarget && removeMutation.mutate(removeTarget.id)}
                    />
                </>
            )}
        </div>
    );
}
