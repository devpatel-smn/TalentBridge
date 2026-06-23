import { useQuery } from '@tanstack/react-query';
import { UserPlus, Users } from 'lucide-react';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { employerApi } from '@/features/employer/api/employer-api';
import { getApiErrorMessage } from '@/lib/api-client';

interface EmployerDashboardData {
    team?: { active_members?: number };
}

export function TeamPage() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'dashboard'],
        queryFn: employerApi.dashboard,
    });

    const dashboard = data as EmployerDashboardData | undefined;
    const activeMembers = dashboard?.team?.active_members ?? 0;

    if (isLoading) {
        return <LoadingSpinner label="Loading team..." />;
    }

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
                description="Manage your company's hiring team"
                actions={
                    <Button disabled>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite member
                    </Button>
                }
            />

            <StatCard
                title="Active team members"
                value={activeMembers}
                icon={<Users className="h-4 w-4" />}
                className="max-w-sm"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Team management</CardTitle>
                    <CardDescription>
                        Invite colleagues and manage roles across your hiring team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center">
                        <Users className="mb-4 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Team members</h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            {activeMembers > 0
                                ? `Your company has ${activeMembers} active team member${activeMembers === 1 ? '' : 's'}. Full team management with invites, roles, and permissions is coming soon.`
                                : 'Invite team members to collaborate on hiring. Team management features are coming soon.'}
                        </p>
                        <Button className="mt-6" disabled>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite team member
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
