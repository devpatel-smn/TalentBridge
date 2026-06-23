import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { employerApi } from '@/features/employer/api/employer-api';
import { getApiErrorMessage } from '@/lib/api-client';

interface EmployerDashboardData {
    jobs?: { total?: number; published?: number };
    applications?: { total?: number; pending_review?: number };
    interviews?: { upcoming?: number };
}

export function EmployerAnalyticsPage() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'dashboard'],
        queryFn: employerApi.dashboard,
    });

    const dashboard = data as EmployerDashboardData | undefined;

    if (isLoading) {
        return <LoadingSpinner label="Loading analytics..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load analytics"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analytics"
                description="Hiring performance insights for your company"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active jobs"
                    value={dashboard?.jobs?.published ?? 0}
                    icon={<BarChart3 className="h-4 w-4" />}
                />
                <StatCard
                    title="Total applications"
                    value={dashboard?.applications?.total ?? 0}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
                <StatCard
                    title="Pending review"
                    value={dashboard?.applications?.pending_review ?? 0}
                />
                <StatCard
                    title="Upcoming interviews"
                    value={dashboard?.interviews?.upcoming ?? 0}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed analytics</CardTitle>
                    <CardDescription>
                        Advanced hiring analytics and reporting are coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center">
                        <BarChart3 className="mb-4 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Analytics dashboard</h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Track application funnel conversion, time-to-hire, source effectiveness,
                            and interview outcomes. This section will be expanded in a future release.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
