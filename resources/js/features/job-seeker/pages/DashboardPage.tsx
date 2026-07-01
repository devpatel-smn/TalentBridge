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
import { useAuth } from '@/hooks/useAuth';
import { JOB_SEEKER_PATHS } from '@/lib/paths';
import { cn } from '@/lib/utils';

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

    if (isLoading) return <LoadingSpinner label="Loading your dashboard..." />;

    if (isError || !data) {
        return <ErrorState title="Unable to load dashboard" description="Please try again in a moment." onRetry={() => refetch()} />;
    }

    const completion = data.profile_completion ?? user?.job_seeker_profile?.profile_completion ?? 0;
    const resumeCompletion = data.resumes.total > 0 ? 100 : 0;

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
