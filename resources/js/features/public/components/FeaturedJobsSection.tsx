import { useState, type MouseEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Clock, MapPin, TrendingUp } from 'lucide-react';
import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import { CompanyAvatar } from '@/components/common/CompanyAvatar';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { StaggerReveal } from '@/components/common/RevealSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeaturedJobs } from '@/features/public/hooks/useHomepageJobs';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/constants';
import { getApiErrorMessage } from '@/lib/api-client';
import { jobCardImage } from '@/lib/images';
import { PUBLIC_PATHS } from '@/lib/paths';
import { cn, formatRelativeDate, formatSalary, titleCase } from '@/lib/utils';
import { toast } from 'sonner';
import type { Job, WorkMode } from '@/types/models';

function workModeBadgeClass(mode: WorkMode): string {
    if (mode === 'remote') return 'work-mode-badge-remote';
    if (mode === 'hybrid') return 'work-mode-badge-hybrid';
    return 'work-mode-badge-onsite';
}

function FeaturedJobCard({ job }: { job: Job }) {
    const { isAuthenticated, role } = useAuth();
    const queryClient = useQueryClient();
    const [authOpen, setAuthOpen] = useState(false);
    const location = [job.location_city, job.location_country].filter(Boolean).join(', ');
    const jobPath = PUBLIC_PATHS.job(job.uuid);
    const canSave = isAuthenticated && role === ROLES.JOB_SEEKER;

    const saveMutation = useMutation({
        mutationFn: () => jobSeekerApi.savedJobs.save(job.uuid),
        onSuccess: () => {
            toast.success('Job saved');
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'saved-jobs'] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to save job')),
    });

    const handleSave = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!canSave) {
            setAuthOpen(true);
            return;
        }
        saveMutation.mutate();
    };

    return (
        <>
            <article className="landing-card group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden">
                    <OptimizedImage
                        src={jobCardImage(job.work_mode)}
                        alt={`${titleCase(job.work_mode)} workplace`}
                        className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-card/25" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
                        <CompanyAvatar name={job.company?.name ?? ''} size="md" />
                        <div className="min-w-0 flex-1">
                            {job.company && (
                                <p className="truncate text-xs font-medium text-foreground/80">{job.company.name}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <Link
                            to={jobPath}
                            className="font-display text-lg font-medium leading-snug text-foreground transition-colors hover:text-gold"
                        >
                            {job.title}
                        </Link>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    <span className={cn('work-mode-badge', workModeBadgeClass(job.work_mode))}>
                        {titleCase(job.work_mode)}
                    </span>
                    <Badge variant="outline" className="rounded-full text-[0.6875rem] font-medium">
                        {titleCase(job.employment_type)}
                    </Badge>
                    {job.experience_level && (
                        <Badge variant="secondary" className="rounded-full text-[0.6875rem] font-medium">
                            {titleCase(job.experience_level)}
                        </Badge>
                    )}
                </div>

                <div className="mt-5 space-y-2.5 text-sm">
                    {location && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                            <span className="truncate">{location}</span>
                        </p>
                    )}
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                        <TrendingUp className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.is_salary_visible)}
                    </p>
                    {job.published_at && (
                        <p className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                            Posted {formatRelativeDate(job.published_at)}
                        </p>
                    )}
                </div>

                <div className="mt-auto flex flex-col gap-2.5 pt-5 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl"
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        aria-label={`Save ${job.title}`}
                    >
                        <Bookmark className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
                        {saveMutation.isPending ? 'Saving…' : 'Save job'}
                    </Button>
                    <Button size="sm" variant="gold" asChild className="flex-1 rounded-xl">
                        <Link to={jobPath}>
                            Apply now
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                </div>
            </article>

            <AuthPromptDialog
                open={authOpen}
                onOpenChange={setAuthOpen}
                returnTo={jobPath}
                title="Sign in to save this job"
                description="Create a free account to save roles and track opportunities you're interested in."
            />
        </>
    );
}

export function FeaturedJobsSection() {
    const { jobs, isLoading } = useFeaturedJobs();

    if (!isLoading && jobs.length === 0) {
        return null;
    }

    return (
        <section data-section-tone="light" className="section-spacing overflow-x-clip bg-background">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                        <p className="section-eyebrow">Featured jobs</p>
                        <h2 className="section-title-lg">Roles worth your attention</h2>
                        <p className="section-description">
                            Hand-picked openings from verified employers — salary, location, and fit at a glance.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="w-fit rounded-xl">
                        <Link to={PUBLIC_PATHS.jobs}>
                            Browse all roles
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-[22rem] rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <StaggerReveal
                        variant="fade-up"
                        staggerMs={70}
                        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {jobs.map((job) => (
                            <FeaturedJobCard key={job.uuid} job={job} />
                        ))}
                    </StaggerReveal>
                )}
            </div>
        </section>
    );
}
