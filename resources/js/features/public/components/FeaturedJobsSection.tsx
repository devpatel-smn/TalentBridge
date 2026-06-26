import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Building2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { PUBLIC_PATHS } from '@/lib/paths';
import { formatSalary, titleCase } from '@/lib/utils';
import type { Job } from '@/types/models';

function JobCard({ job, featured = false }: { job: Job; featured?: boolean }) {
    const location = [job.location_city, job.location_country].filter(Boolean).join(', ');

    if (featured) {
        return (
            <Link
                to={PUBLIC_PATHS.job(job.uuid)}
                className="card-premium group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-border/60 bg-charcoal p-8 text-white shadow-elevation-3"
            >
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                        alt=""
                        className="h-full w-full object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
                </div>
                <div className="relative">
                    <Badge className="mb-4 bg-highlight/90 text-highlight-foreground hover:bg-highlight">
                        Featured role
                    </Badge>
                    <h3 className="font-display text-2xl font-medium leading-snug transition-colors group-hover:text-gold">
                        {job.title}
                    </h3>
                    {job.company && (
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
                            <Building2 className="h-4 w-4" />
                            {job.company.name}
                        </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-gold">
                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.is_salary_visible)}
                        </span>
                        {location && (
                            <span className="flex items-center gap-1 text-sm text-white/50">
                                <MapPin className="h-3.5 w-3.5" />
                                {location}
                            </span>
                        )}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                        View role <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={PUBLIC_PATHS.job(job.uuid)}
            className="card-premium group flex h-full min-w-0 flex-col rounded-xl border border-border/60 bg-card p-6 shadow-elevation-1 dark:border-border/80 dark:bg-card"
        >
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[0.6875rem] font-medium uppercase tracking-wide">
                    {titleCase(job.work_mode)}
                </Badge>
                <Badge variant="outline" className="text-[0.6875rem]">
                    {titleCase(job.employment_type)}
                </Badge>
            </div>
            <h3 className="mt-4 font-display text-lg font-medium leading-snug transition-colors group-hover:text-secondary">
                {job.title}
            </h3>
            {job.company && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {job.company.name}
                </p>
            )}
            <div className="mt-auto pt-5">
                {location && (
                    <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {location}
                    </p>
                )}
                <p className="text-sm font-semibold text-foreground">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.is_salary_visible)}
                </p>
            </div>
        </Link>
    );
}

export function FeaturedJobsSection() {
    const { data, isLoading } = useQuery({
        queryKey: ['jobs', 'featured'],
        queryFn: () => jobsApi.list({ per_page: 6, sort: 'published_at', order: 'desc' }),
    });

    const jobs = data?.data ?? [];
    const [featured, ...rest] = jobs;

    if (!isLoading && jobs.length === 0) {
        return null;
    }

    return (
        <section className="landing-section-canvas overflow-x-clip py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Opportunities</p>
                        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl lg:text-[2.75rem]">
                            Roles worth your attention
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Curated positions from verified employers — updated daily.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="w-fit rounded-lg">
                        <Link to={PUBLIC_PATHS.jobs}>
                            All open roles
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 grid gap-4 lg:grid-cols-3">
                    {isLoading ? (
                        <>
                            <Skeleton className="min-h-[320px] rounded-2xl lg:row-span-2" />
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-44 rounded-xl" />
                            ))}
                        </>
                    ) : (
                        <>
                            {featured && (
                                <div className="lg:row-span-2">
                                    <JobCard job={featured} featured />
                                </div>
                            )}
                            {rest.slice(0, 4).map((job) => (
                                <JobCard key={job.uuid} job={job} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
