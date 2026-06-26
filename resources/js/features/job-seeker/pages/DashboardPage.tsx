import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Bookmark,
    Briefcase,
    FileText,
    Send,
    Sparkles,
    User,
    Video,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageSection } from '@/components/common/PageSection';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { UpcomingInterviewsWidget } from '@/features/interviews/components/UpcomingInterviewsWidget';
import { useAuth } from '@/hooks/useAuth';
import { JOB_SEEKER_PATHS } from '@/lib/paths';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { cn, formatDate } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { Job, JobApplication } from '@/types/models';

interface DashboardData {
    profile_completion: number;
    saved_jobs: number;
    applications: { total: number };
    interviews: {
        upcoming: number;
        total: number;
        today?: number;
        this_week?: number;
        scheduled?: number;
        completed?: number;
        cancelled?: number;
    };
    recommendations: { active: number };
    resumes: { total: number };
}

export function JobSeekerDashboardPage() {
    const { user } = useAuth();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['job-seeker', 'dashboard'],
        queryFn: async () => (await jobSeekerApi.dashboard()) as unknown as DashboardData,
    });

    const { data: recentApps } = useQuery({
        queryKey: ['job-seeker', 'applications', 'recent'],
        queryFn: () => jobSeekerApi.applications.list({ per_page: 4 }),
    });

    const { data: recommendations = [] } = useQuery({
        queryKey: ['job-seeker', 'recommendations', 'dashboard'],
        queryFn: async () => {
            try {
                const { data: res } = await apiClient.get<ApiResponse<{ job?: Job; score?: number }[]>>('/job-seeker/recommendations');
                return res.data ?? [];
            } catch {
                return [];
            }
        },
    });

    if (isLoading) return <LoadingSpinner label="Loading your dashboard..." />;

    if (isError || !data) {
        return <ErrorState title="Unable to load dashboard" description="Please try again in a moment." onRetry={() => refetch()} />;
    }

    const completion = data.profile_completion ?? user?.job_seeker_profile?.profile_completion ?? 0;
    const resumeCompletion = data.resumes.total > 0 ? 100 : 0;
    const applications = (recentApps?.data ?? []) as JobApplication[];

    return (
        <div className="space-y-8">
            <PageHeader
                title={`Welcome back, ${user?.first_name ?? 'there'}`}
                description="Your personalized career workspace — track progress, discover roles, and land your next opportunity."
                breadcrumbs={[{ label: 'Dashboard' }]}
            />

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="relative overflow-hidden border-primary/20 bg-card shadow-sm">
                <CardHeader className="relative border-b border-border/60 bg-muted/40 pb-3">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">Profile completion</CardTitle>
                            <CardDescription>Complete your profile to stand out to employers</CardDescription>
                        </div>
                        <span className="text-4xl font-bold tabular-nums text-primary">{completion}%</span>
                    </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-700"
                            style={{ width: `${completion}%` }}
                        />
                    </div>
                    {completion < 100 && (
                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                            <Link to={JOB_SEEKER_PATHS.profile}>
                                Complete profile
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="border-b border-border/60 pb-3">
                        <CardTitle className="text-xl">Resume status</CardTitle>
                        <CardDescription>
                            {data.resumes.total > 0
                                ? `${data.resumes.total} resume(s) ready for applications`
                                : 'Add a resume to start applying'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="h-3 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-secondary transition-all duration-700"
                                style={{ width: `${resumeCompletion}%` }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="rounded-xl">
                                <Link to={JOB_SEEKER_PATHS.resume}>
                                    {data.resumes.total > 0 ? 'Manage resumes' : 'Create resume'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Applications"
                    value={data.applications.total}
                    icon={Send}
                    iconVariant="primary"
                    description="Total submitted"
                />
                <StatCard
                    title="Upcoming interviews"
                    value={data.interviews.upcoming}
                    icon={Video}
                    iconVariant="success"
                    description={`${data.interviews.total} total`}
                />
                <StatCard
                    title="Saved jobs"
                    value={data.saved_jobs}
                    icon={Bookmark}
                    iconVariant="muted"
                />
                <StatCard
                    title="Recommendations"
                    value={data.recommendations.active}
                    icon={Sparkles}
                    iconVariant="warning"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-3">
                <StatCard
                    title="Today's interviews"
                    value={data.interviews.today ?? 0}
                    icon={Video}
                    iconVariant="primary"
                />
                <StatCard
                    title="This week"
                    value={data.interviews.this_week ?? 0}
                    icon={Video}
                    iconVariant="muted"
                />
                <StatCard
                    title="Completed"
                    value={data.interviews.completed ?? 0}
                    description={`${data.interviews.cancelled ?? 0} cancelled`}
                    icon={Video}
                    iconVariant="warning"
                />
            </div>

            <UpcomingInterviewsWidget
                listHref={JOB_SEEKER_PATHS.interviews}
                queryKey={['job-seeker', 'interviews', 'upcoming-widget']}
                queryFn={() => jobSeekerApi.interviews.upcoming({ per_page: 5 })}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <PageSection
                    title="Recommended for you"
                    description="Jobs matched to your profile"
                    actions={
                        <Button variant="ghost" size="sm" asChild className="rounded-xl">
                            <Link to={JOB_SEEKER_PATHS.recommendations}>View all</Link>
                        </Button>
                    }
                >
                    {recommendations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Complete your profile to unlock personalized recommendations.</p>
                    ) : (
                        <div className="space-y-3">
                            {recommendations.slice(0, 3).map((rec, i) => {
                                const job = rec.job;
                                if (!job) return null;
                                return (
                                    <Link key={job.uuid ?? i} to={JOB_SEEKER_PATHS.job(job.uuid)}>
                                        <Card className="transition-all hover:border-primary/25 hover:shadow-elevation-1">
                                            <CardContent className="flex items-center justify-between gap-3 p-4">
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">{job.title}</p>
                                                    <p className="truncate text-sm text-muted-foreground">{job.company?.name}</p>
                                                </div>
                                                {rec.score != null && (
                                                    <Badge variant="secondary">{Math.round(rec.score)}% match</Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </PageSection>

                <PageSection
                    title="Recent applications"
                    description="Latest activity on your applications"
                    actions={
                        <Button variant="ghost" size="sm" asChild className="rounded-xl">
                            <Link to={JOB_SEEKER_PATHS.applications}>View all</Link>
                        </Button>
                    }
                >
                    {applications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No applications yet. Start exploring open roles.</p>
                    ) : (
                        <div className="space-y-3">
                            {applications.map((app) => (
                                <Card key={app.uuid} className="transition-all hover:shadow-elevation-1">
                                    <CardContent className="flex items-center justify-between gap-3 p-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{app.job?.title ?? 'Application'}</p>
                                            <p className="text-xs text-muted-foreground">Applied {formatDate(app.applied_at)}</p>
                                        </div>
                                        <StatusBadge status={app.status} />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </PageSection>
            </div>

            <PageSection title="Quick navigation" description="Jump to the tools you need most">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { label: 'Search jobs', href: JOB_SEEKER_PATHS.jobs, icon: Briefcase, desc: 'Find your next role' },
                        { label: 'My applications', href: JOB_SEEKER_PATHS.applications, icon: Send, desc: 'Track application status' },
                        { label: 'Interviews', href: JOB_SEEKER_PATHS.interviews, icon: Video, desc: 'Manage scheduled interviews' },
                        { label: 'Edit profile', href: JOB_SEEKER_PATHS.profile, icon: User, desc: 'Update your information' },
                        { label: 'Resumes', href: JOB_SEEKER_PATHS.resume, icon: FileText, desc: `${data.resumes.total} resume(s)` },
                        { label: 'Recommendations', href: JOB_SEEKER_PATHS.recommendations, icon: Sparkles, desc: 'Jobs matched for you' },
                    ].map((item) => (
                        <Link key={item.href} to={item.href}>
                            <Card className={cn('group h-full transition-all hover:border-primary/25 hover:shadow-elevation-2')}>
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </PageSection>
        </div>
    );
}
