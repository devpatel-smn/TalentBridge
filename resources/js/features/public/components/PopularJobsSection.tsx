import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealSection, StaggerReveal } from '@/components/common/RevealSection';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePopularJobCounts } from '@/features/public/hooks/useHomepageJobs';
import { IMAGES } from '@/lib/images';
import { PUBLIC_PATHS } from '@/lib/paths';
import { cn, titleCase } from '@/lib/utils';

const popularJobs = [
    {
        title: 'Jobs for Freshers',
        description: 'Entry-level roles for graduates and early-career professionals.',
        category: 'Early Career',
        employmentType: 'full_time',
        location: 'Pan India',
        image: IMAGES.jobs.freshers,
        alt: 'Early career professionals collaborating',
        imagePosition: 'object-center',
        search: 'fresher',
        countKey: 'fresher' as const,
    },
    {
        title: 'Full Time Jobs',
        description: 'Long-term career opportunities with leading teams across industries.',
        category: 'Full Time',
        employmentType: 'full_time',
        location: 'Major Hiring Hubs',
        image: IMAGES.jobs.fullTime,
        alt: 'Full-time team at work',
        imagePosition: 'object-center',
        search: 'full time',
        countKey: 'fullTime' as const,
    },
    {
        title: 'Part Time Jobs',
        description: 'Flexible roles for professionals balancing study, family, or side projects.',
        category: 'Flexible Work',
        employmentType: 'part_time',
        location: 'Multiple Cities',
        image: IMAGES.jobs.partTime,
        alt: 'Flexible work environment',
        imagePosition: 'object-center',
        search: 'part time',
        countKey: 'partTime' as const,
    },
    {
        title: 'Work From Home',
        description: 'Remote-first positions with modern companies hiring beyond geography.',
        category: 'Remote',
        employmentType: 'full_time',
        location: 'Worldwide',
        image: IMAGES.jobs.remoteWork,
        alt: 'Professional working remotely',
        imagePosition: 'object-center',
        search: 'remote',
        countKey: 'remote' as const,
    },
];

function formatCount(count: number, total?: number): string {
    if (count > 0) return `${count.toLocaleString()}+ roles`;
    if (total != null && total > 0) return `${total.toLocaleString()}+ roles`;
    return 'Explore roles';
}

export function PopularJobsSection() {
    const { counts, total } = usePopularJobCounts();

    return (
        <section data-section-tone="light" className="section-spacing overflow-x-clip bg-background">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <RevealSection variant="fade-up" className="mx-auto max-w-2xl text-center">
                    <p className="section-eyebrow">Popular jobs</p>
                    <h2 className="section-title-lg">Explore trending categories</h2>
                    <p className="section-description md:text-lg">
                        High-interest roles professionals search for most — bright visuals, clear paths to apply.
                    </p>
                </RevealSection>

                <StaggerReveal
                    variant="fade-up"
                    staggerMs={60}
                    className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-2"
                >
                    {popularJobs.map((job) => (
                        <Link
                            key={job.title}
                            to={`${PUBLIC_PATHS.jobs}?search=${encodeURIComponent(job.search)}`}
                            className="group card-glow-hover flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-elevation-1"
                        >
                            <div className="relative h-48 overflow-hidden bg-muted/20 sm:h-52">
                                <OptimizedImage
                                    src={job.image}
                                    alt={job.alt}
                                    priority
                                    className={cn(
                                        'object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                                        job.imagePosition,
                                    )}
                                />
                            </div>

                            <div className="flex flex-1 flex-col p-5 md:p-6">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="rounded-full text-[0.6875rem] font-medium">
                                        {job.category}
                                    </Badge>
                                    <Badge variant="outline" className="rounded-full text-[0.6875rem] font-medium">
                                        {titleCase(job.employmentType)}
                                    </Badge>
                                </div>
                                <h3 className="mt-4 font-display text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-gold">
                                    {job.title}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                                    {job.description}
                                </p>
                                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={1.5} />
                                    {job.location}
                                </p>
                                <p className="mt-2 text-xs font-medium text-gold">
                                    {formatCount(counts[job.countKey], total)}
                                </p>
                                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold">
                                    Explore roles
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </StaggerReveal>

                <div className="mt-10 text-center">
                    <Button variant="outline" asChild className="rounded-xl">
                        <Link to={PUBLIC_PATHS.jobs}>
                            View all job categories
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
