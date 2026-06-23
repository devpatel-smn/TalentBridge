import { useQuery } from '@tanstack/react-query';
import {
    Briefcase,
    ClipboardList,
    ShieldCheck,
    Users,
    Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employerApi } from '@/features/employer/api/employer-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { titleCase } from '@/lib/utils';

interface EmployerDashboardData {
    company?: {
        uuid?: string;
        name?: string;
        verification_status?: string;
        verified_at?: string | null;
    };
    team?: { active_members?: number };
    jobs?: { total?: number; published?: number; draft?: number; closed?: number };
    applications?: { total?: number; today?: number; pending_review?: number };
    interviews?: { upcoming?: number };
    verification?: { latest_status?: string | null; pending_review?: boolean };
}

export function EmployerDashboardPage() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'dashboard'],
        queryFn: employerApi.dashboard,
    });

    const dashboard = data as EmployerDashboardData | undefined;

    if (isLoading) {
        return <LoadingSpinner label="Loading dashboard..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load dashboard"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description={
                    dashboard?.company?.name
                        ? `Overview for ${dashboard.company.name}`
                        : 'Your hiring overview at a glance'
                }
                actions={
                    <Button asChild>
                        <Link to="/employer/jobs/new">Post a job</Link>
                    </Button>
                }
            />

            {dashboard?.company?.verification_status && dashboard.company.verification_status !== 'approved' && (
                <Card className="border-warning/30 bg-warning/5">
                    <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-warning" />
                            <div>
                                <p className="font-medium">Company verification</p>
                                <p className="text-sm text-muted-foreground">
                                    Complete verification to unlock full employer features.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={dashboard.company.verification_status} />
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/employer/verification">Verify now</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total jobs"
                    value={dashboard?.jobs?.total ?? 0}
                    description={`${dashboard?.jobs?.published ?? 0} published`}
                    icon={<Briefcase className="h-4 w-4" />}
                />
                <StatCard
                    title="Applications"
                    value={dashboard?.applications?.total ?? 0}
                    description={`${dashboard?.applications?.today ?? 0} today`}
                    icon={<ClipboardList className="h-4 w-4" />}
                />
                <StatCard
                    title="Pending review"
                    value={dashboard?.applications?.pending_review ?? 0}
                    description="Awaiting action"
                    icon={<ClipboardList className="h-4 w-4" />}
                />
                <StatCard
                    title="Upcoming interviews"
                    value={dashboard?.interviews?.upcoming ?? 0}
                    icon={<Video className="h-4 w-4" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Job breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{dashboard?.jobs?.published ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Published</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{dashboard?.jobs?.draft ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Draft</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{dashboard?.jobs?.closed ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Closed</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Team & verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                Active team members
                            </div>
                            <span className="font-semibold">{dashboard?.team?.active_members ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Verification status</span>
                            {dashboard?.company?.verification_status ? (
                                <StatusBadge status={dashboard.company.verification_status} />
                            ) : (
                                <span className="text-sm">—</span>
                            )}
                        </div>
                        {dashboard?.verification?.latest_status && (
                            <p className="text-xs text-muted-foreground">
                                Latest submission: {titleCase(dashboard.verification.latest_status)}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
