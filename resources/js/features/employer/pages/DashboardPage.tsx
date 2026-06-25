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
import { QuickAccessPanel } from '@/components/common/QuickAccessPanel';
import { StatCard } from '@/components/common/StatCard';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employerApi } from '@/features/employer/api/employer-api';
import { UpcomingInterviewsWidget } from '@/features/interviews/components/UpcomingInterviewsWidget';
import { getApiErrorMessage } from '@/lib/api-client';
import { titleCase } from '@/lib/utils';

const EMPLOYER_QUICK_ACCESS = [
    {
        href: '/employer/jobs',
        icon: Briefcase,
        label: 'Manage jobs',
        description: 'Create, publish, and track your open positions',
        iconVariant: 'primary' as const,
    },
    {
        href: '/employer/applicants',
        icon: ClipboardList,
        label: 'Review applicants',
        description: 'Screen candidates and update application status',
        iconVariant: 'success' as const,
    },
    {
        href: '/employer/interviews',
        icon: Video,
        label: 'Schedule interviews',
        description: 'Plan and manage candidate interview sessions',
        iconVariant: 'muted' as const,
    },
];

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
    interviews?: {
        upcoming?: number;
        today?: number;
        this_week?: number;
        scheduled?: number;
        completed?: number;
        cancelled?: number;
    };
    verification?: { latest_status?: string | null; pending_review?: boolean };
}

function JobStatusPill({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-center">
            <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        </div>
    );
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
        <div className="space-y-8">
            <PageHeader
                title="Dashboard"
                description={
                    dashboard?.company?.name
                        ? `Overview for ${dashboard.company.name}`
                        : 'Your hiring overview at a glance'
                }
                breadcrumbs={[{ label: 'Employer' }]}
                actions={
                    <Button className="rounded-xl" asChild>
                        <Link to="/employer/jobs/new">Post a job</Link>
                    </Button>
                }
            />

            {dashboard?.company?.verification_status && dashboard.company.verification_status !== 'approved' && (
                <Card className="border-warning/30 bg-warning/5 shadow-sm">
                    <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/15">
                                <ShieldCheck className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="font-semibold">Company verification required</p>
                                <p className="text-sm text-muted-foreground">
                                    Complete verification to unlock full employer features.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={dashboard.company.verification_status} />
                            <Button variant="outline" size="sm" className="rounded-xl" asChild>
                                <Link to="/employer/verification">Verify now</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <QuickAccessPanel title="Quick access" description="Shortcuts to your hiring workflow" items={EMPLOYER_QUICK_ACCESS} />

            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total jobs"
                    value={dashboard?.jobs?.total ?? 0}
                    description={`${dashboard?.jobs?.published ?? 0} published`}
                    icon={Briefcase}
                    iconVariant="primary"
                />
                <StatCard
                    title="Applications"
                    value={dashboard?.applications?.total ?? 0}
                    description={`${dashboard?.applications?.today ?? 0} today`}
                    icon={ClipboardList}
                    iconVariant="success"
                    trend={(dashboard?.applications?.today ?? 0) > 0 ? 'up' : 'neutral'}
                />
                <StatCard
                    title="Pending review"
                    value={dashboard?.applications?.pending_review ?? 0}
                    description="Awaiting action"
                    icon={ClipboardList}
                    iconVariant="warning"
                />
                <StatCard
                    title="Upcoming interviews"
                    value={dashboard?.interviews?.upcoming ?? 0}
                    description={`${dashboard?.interviews?.today ?? 0} today`}
                    icon={Video}
                    iconVariant="muted"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-3">
                <StatCard
                    title="Today's interviews"
                    value={dashboard?.interviews?.today ?? 0}
                    icon={Video}
                    iconVariant="primary"
                />
                <StatCard
                    title="This week"
                    value={dashboard?.interviews?.this_week ?? 0}
                    icon={Video}
                    iconVariant="success"
                />
                <StatCard
                    title="Completed"
                    value={dashboard?.interviews?.completed ?? 0}
                    description={`${dashboard?.interviews?.cancelled ?? 0} cancelled`}
                    icon={Video}
                    iconVariant="warning"
                />
            </div>

            <UpcomingInterviewsWidget
                listHref="/employer/interviews"
                queryKey={['employer', 'interviews', 'upcoming-widget']}
                queryFn={() => employerApi.interviews.upcoming({ per_page: 5 })}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Job breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-3">
                        <JobStatusPill label="Published" value={dashboard?.jobs?.published ?? 0} color="text-success" />
                        <JobStatusPill label="Draft" value={dashboard?.jobs?.draft ?? 0} color="text-muted-foreground" />
                        <JobStatusPill label="Closed" value={dashboard?.jobs?.closed ?? 0} color="text-foreground" />
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Team & verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                Active team members
                            </div>
                            <span className="text-lg font-bold tabular-nums">{dashboard?.team?.active_members ?? 0}</span>
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
