import { useQuery } from '@tanstack/react-query';
import {
    Briefcase,
    Building2,
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/features/admin/api/admin-api';
import { cn, titleCase } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const STAT_ICONS: Record<string, LucideIcon> = {
    users: Users,
    jobs: Briefcase,
    verifications: ShieldCheck,
    applications: ClipboardList,
    interviews: Video,
};

const STAT_CONFIG: Array<{
    key: string;
    title: string;
    path: string;
    description?: string;
    iconVariant?: 'primary' | 'success' | 'warning' | 'muted';
}> = [
    { key: 'users.total', title: 'Total Users', path: '/admin/users', iconVariant: 'primary' },
    { key: 'users.new_last_7_days', title: 'New Users (7d)', path: '/admin/users', description: 'Last 7 days', iconVariant: 'success' },
    { key: 'jobs.total', title: 'Total Jobs', path: '/admin/jobs', iconVariant: 'primary' },
    { key: 'jobs.active_published', title: 'Published Jobs', path: '/admin/jobs', description: 'Currently active', iconVariant: 'success' },
    { key: 'verifications.pending', title: 'Pending Verifications', path: '/admin/verifications', iconVariant: 'warning' },
    { key: 'applications.today', title: 'Applications Today', path: '/admin/analytics', iconVariant: 'primary' },
    { key: 'interviews.this_week', title: 'Interviews This Week', path: '/admin/interviews', iconVariant: 'muted' },
];

const METRIC_BAR_COLORS = ['bg-primary', 'bg-secondary', 'bg-info', 'bg-success', 'bg-warning'] as const;

const QUICK_ACCESS = [
    {
        href: '/admin/admins',
        icon: Users,
        label: 'Manage admins',
        description: 'Create administrators and control active access',
        iconVariant: 'primary' as const,
    },
    {
        href: '/admin/users',
        icon: Users,
        label: 'Manage job seekers',
        description: 'View job seeker accounts, profiles, and status',
        iconVariant: 'primary' as const,
    },
    {
        href: '/admin/verifications',
        icon: ShieldCheck,
        label: 'Review verifications',
        description: 'Approve or reject employer company submissions',
        iconVariant: 'warning' as const,
    },
    {
        href: '/admin/companies',
        icon: Building2,
        label: 'View companies',
        description: 'Browse registered employers and company profiles',
        iconVariant: 'success' as const,
    },
];

function readMetric(data: Record<string, unknown> | undefined, path: string): number {
    if (!data) return 0;

    let current: unknown = data;
    for (const part of path.split('.')) {
        if (current == null || typeof current !== 'object') return 0;
        current = (current as Record<string, unknown>)[part];
    }

    return typeof current === 'number' ? current : 0;
}

function getTopLevelKey(path: string): string {
    return path.split('.')[0] ?? path;
}

interface IndustryRow {
    industry: string;
    total: number;
}

function MetricBar({
    label,
    value,
    max,
    colorClass,
}: {
    label: string;
    value: number;
    max: number;
    colorClass: string;
}) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <span className="font-semibold tabular-nums text-foreground">{value.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn('h-full rounded-full transition-all duration-500', colorClass)}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export function AdminDashboardPage() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: adminApi.dashboard,
    });

    if (isLoading) {
        return <LoadingSpinner label="Loading dashboard..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load dashboard"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    const metrics = (data ?? {}) as Record<string, unknown>;
    const topIndustries = Array.isArray(metrics.top_industries)
        ? (metrics.top_industries as IndustryRow[])
        : [];
    const usersByRole =
        metrics.users && typeof metrics.users === 'object'
            ? ((metrics.users as Record<string, unknown>).by_role as Record<string, number> | undefined)
            : undefined;

    const maxIndustry = Math.max(...topIndustries.map((r) => r.total), 1);
    const maxRole = usersByRole ? Math.max(...Object.values(usersByRole), 1) : 1;

    return (
        <div className="space-y-8">
            <PageHeader
                title="Admin Dashboard"
                description="Platform overview and key metrics at a glance."
                breadcrumbs={[{ label: 'Admin' }]}
                actions={
                    <Button variant="outline" className="rounded-xl" asChild>
                        <Link to="/admin/analytics">View analytics</Link>
                    </Button>
                }
            />

            <QuickAccessPanel items={QUICK_ACCESS} />

            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
                {STAT_CONFIG.map((stat) => {
                    const Icon = STAT_ICONS[getTopLevelKey(stat.key)];
                    return (
                        <Link key={stat.key} to={stat.path} className="block h-full min-w-0">
                            <StatCard
                                title={stat.title}
                                value={readMetric(metrics, stat.key).toLocaleString()}
                                description={stat.description}
                                icon={Icon}
                                iconVariant={stat.iconVariant}
                            />
                        </Link>
                    );
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {usersByRole && Object.keys(usersByRole).length > 0 && (
                    <Card className="border-border/80 bg-card shadow-sm">
                        <CardHeader className="border-b border-border/60 bg-muted/40">
                            <CardTitle>Users by Role</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {Object.entries(usersByRole).map(([role, count], index) => (
                                <MetricBar
                                    key={role}
                                    label={titleCase(role)}
                                    value={count}
                                    max={maxRole}
                                    colorClass={METRIC_BAR_COLORS[index % METRIC_BAR_COLORS.length]}
                                />
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card className="border-border/80 bg-card shadow-sm">
                    <CardHeader className="border-b border-border/60 bg-muted/40">
                        <CardTitle>Top Industries</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {topIndustries.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No industry data available.</p>
                        ) : (
                            <div className="space-y-4">
                                {topIndustries.map((row, index) => (
                                    <MetricBar
                                        key={row.industry}
                                        label={row.industry}
                                        value={row.total}
                                        max={maxIndustry}
                                        colorClass={METRIC_BAR_COLORS[index % METRIC_BAR_COLORS.length]}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
