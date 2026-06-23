import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
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
import { StatCard } from '@/components/common/StatCard';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/features/admin/api/admin-api';
import { titleCase } from '@/lib/utils';

const STAT_ICONS: Record<string, ReactNode> = {
    users: <Users className="h-4 w-4" />,
    jobs: <Briefcase className="h-4 w-4" />,
    verifications: <ShieldCheck className="h-4 w-4" />,
    applications: <ClipboardList className="h-4 w-4" />,
    interviews: <Video className="h-4 w-4" />,
};

const STAT_CONFIG: Array<{
    key: string;
    title: string;
    path: string;
    description?: string;
}> = [
    { key: 'users.total', title: 'Total Users', path: '/admin/users' },
    { key: 'users.new_last_7_days', title: 'New Users (7d)', path: '/admin/users', description: 'Last 7 days' },
    { key: 'jobs.total', title: 'Total Jobs', path: '/admin/jobs' },
    { key: 'jobs.active_published', title: 'Published Jobs', path: '/admin/jobs', description: 'Currently active' },
    { key: 'verifications.pending', title: 'Pending Verifications', path: '/admin/verifications' },
    { key: 'applications.today', title: 'Applications Today', path: '/admin/analytics' },
    { key: 'interviews.this_week', title: 'Interviews This Week', path: '/admin/interviews' },
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

    return (
        <div className="space-y-8">
            <PageHeader
                title="Admin Dashboard"
                description="Platform overview and key metrics at a glance."
                actions={
                    <Button variant="outline" asChild>
                        <Link to="/admin/analytics">View analytics</Link>
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STAT_CONFIG.map((stat) => (
                    <Link key={stat.key} to={stat.path} className="block">
                        <StatCard
                            title={stat.title}
                            value={readMetric(metrics, stat.key).toLocaleString()}
                            description={stat.description}
                            icon={STAT_ICONS[getTopLevelKey(stat.key)]}
                        />
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {usersByRole && Object.keys(usersByRole).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Users by Role</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.entries(usersByRole).map(([role, count]) => (
                                <div key={role} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{titleCase(role)}</span>
                                    <span className="font-semibold">{count.toLocaleString()}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top Industries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topIndustries.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No industry data available.</p>
                        ) : (
                            <div className="space-y-3">
                                {topIndustries.map((row) => (
                                    <div key={row.industry} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{row.industry}</span>
                                        <span className="font-semibold">{row.total.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/users">
                            <Users className="mr-2 h-4 w-4" />
                            Manage users
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/verifications">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Review verifications
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/companies">
                            <Building2 className="mr-2 h-4 w-4" />
                            View companies
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
