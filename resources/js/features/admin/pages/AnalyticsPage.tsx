import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Briefcase, ClipboardList, ShieldCheck, Users, Video } from 'lucide-react';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/features/admin/api/admin-api';
import { titleCase } from '@/lib/utils';

function readMetric(data: Record<string, unknown> | undefined, key: string): number {
    if (!data) return 0;
    const value = data[key];
    return typeof value === 'number' ? value : 0;
}

function readRecord(data: Record<string, unknown> | undefined, key: string): Record<string, number> {
    if (!data) return {};
    const value = data[key];
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return value as Record<string, number>;
}

function MetricSection({
    title,
    data,
    emptyMessage = 'No data available.',
}: {
    title: string;
    data: Record<string, number>;
    emptyMessage?: string;
}) {
    const entries = Object.entries(data);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                ) : (
                    <div className="space-y-3">
                        {entries.map(([key, count]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{titleCase(key)}</span>
                                <span className="font-semibold">{count.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface TopCompany {
    uuid: string;
    name: string;
    jobs_count: number;
}

export function AdminAnalyticsPage() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'analytics'],
        queryFn: adminApi.analytics,
    });

    if (isLoading) {
        return <LoadingSpinner label="Loading analytics..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load analytics"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    const analytics = (data ?? {}) as Record<string, unknown>;
    const topCompanies = Array.isArray(analytics.top_companies_by_jobs)
        ? (analytics.top_companies_by_jobs as TopCompany[])
        : [];

    const statCards: Array<{ title: string; key: string; icon: ReactNode }> = [
        { title: 'Published Jobs', key: 'published_jobs', icon: <Briefcase className="h-4 w-4" /> },
        { title: 'Pending Verifications', key: 'pending_verifications', icon: <ShieldCheck className="h-4 w-4" /> },
    ];

    return (
        <div className="space-y-8">
            <PageHeader
                title="Analytics"
                description="Platform trends, funnel metrics, and performance insights."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <StatCard
                        key={stat.key}
                        title={stat.title}
                        value={readMetric(analytics, stat.key).toLocaleString()}
                        icon={stat.icon}
                    />
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <MetricSection title="Jobs by Status" data={readRecord(analytics, 'jobs_by_status')} />
                <MetricSection title="Application Funnel" data={readRecord(analytics, 'application_funnel')} />
                <MetricSection title="Verification Stats" data={readRecord(analytics, 'verification_stats')} />
                <MetricSection title="Interviews by Status" data={readRecord(analytics, 'interviews_by_status')} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="h-4 w-4" />
                            User Growth (12 months)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Array.isArray(analytics.user_growth) && analytics.user_growth.length > 0 ? (
                            <div className="space-y-2">
                                {(analytics.user_growth as Array<{ period: string; total: number }>).map((row) => (
                                    <div key={row.period} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {new Date(row.period).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span className="font-medium">{row.total.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No user growth data available.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ClipboardList className="h-4 w-4" />
                            Job Posting Trends (12 months)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Array.isArray(analytics.job_posting_trends) && analytics.job_posting_trends.length > 0 ? (
                            <div className="space-y-2">
                                {(analytics.job_posting_trends as Array<{ period: string; total: number }>).map(
                                    (row) => (
                                        <div key={row.period} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                {new Date(row.period).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <span className="font-medium">{row.total.toLocaleString()}</span>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No job posting trend data available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Video className="h-4 w-4" />
                        Top Companies by Job Count
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {topCompanies.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No company data available.</p>
                    ) : (
                        <div className="space-y-3">
                            {topCompanies.map((company) => (
                                <div key={company.uuid} className="flex items-center justify-between text-sm">
                                    <span>{company.name}</span>
                                    <span className="font-semibold">{company.jobs_count.toLocaleString()} jobs</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
