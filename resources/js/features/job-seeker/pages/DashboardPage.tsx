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
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface DashboardData {
    profile_completion: number;
    saved_jobs: number;
    applications: { total: number };
    interviews: { upcoming: number; total: number };
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

    return (
        <div className="space-y-8">
            <PageHeader
                title={`Welcome back, ${user?.first_name ?? 'there'}`}
                description="Track your job search progress and upcoming opportunities."
            />

            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">Profile completion</CardTitle>
                            <CardDescription>Complete your profile to stand out to employers</CardDescription>
                        </div>
                        <span className="text-3xl font-bold text-primary">{completion}%</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
                            style={{ width: `${completion}%` }}
                        />
                    </div>
                    {completion < 100 && (
                        <Button asChild variant="outline" size="sm">
                            <Link to="/job-seeker/profile">
                                Complete profile
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Applications"
                    value={data.applications.total}
                    icon={<Send className="h-4 w-4" />}
                    description="Total submitted"
                />
                <StatCard
                    title="Upcoming interviews"
                    value={data.interviews.upcoming}
                    icon={<Video className="h-4 w-4" />}
                    description={`${data.interviews.total} total`}
                />
                <StatCard
                    title="Saved jobs"
                    value={data.saved_jobs}
                    icon={<Bookmark className="h-4 w-4" />}
                />
                <StatCard
                    title="Recommendations"
                    value={data.recommendations.active}
                    icon={<Sparkles className="h-4 w-4" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                    { label: 'Search jobs', href: '/job-seeker/jobs', icon: Briefcase, desc: 'Find your next role' },
                    { label: 'My applications', href: '/job-seeker/applications', icon: Send, desc: 'Track application status' },
                    { label: 'Interviews', href: '/job-seeker/interviews', icon: Video, desc: 'Manage scheduled interviews' },
                    { label: 'Edit profile', href: '/job-seeker/profile', icon: User, desc: 'Update your information' },
                    { label: 'Resumes', href: '/job-seeker/resume', icon: FileText, desc: `${data.resumes.total} resume(s)` },
                    { label: 'Recommendations', href: '/job-seeker/recommendations', icon: Sparkles, desc: 'Jobs matched for you' },
                ].map((item) => (
                    <Link key={item.href} to={item.href}>
                        <Card className={cn('group h-full transition-all hover:border-primary/30 hover:shadow-md')}>
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold">{item.label}</p>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
