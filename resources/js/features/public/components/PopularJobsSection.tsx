import { Briefcase, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealSection, StaggerReveal } from '@/components/common/RevealSection';
import { PUBLIC_PATHS } from '@/lib/paths';

const popularJobs = [
    {
        title: 'Jobs for Freshers',
        description: 'Entry-level roles built for graduates and early-career professionals starting strong.',
        category: 'Early Career',
        location: 'Pan India',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=80',
    },
    {
        title: 'Full Time Jobs',
        description: 'Long-term career opportunities with leading teams across high-growth industries.',
        category: 'Full Time',
        location: 'Major Hiring Hubs',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80',
    },
    {
        title: 'Part Time Jobs',
        description: 'Flexible roles for professionals balancing study, family, or additional commitments.',
        category: 'Flexible Work',
        location: 'Multiple Cities',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80',
    },
    {
        title: 'Work From Home Jobs',
        description: 'Remote-first positions with modern companies hiring beyond geography.',
        category: 'Remote',
        location: 'Worldwide',
        image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=700&q=80',
    },
];

export function PopularJobsSection() {
    return (
        <section className="landing-section-hero grain-overlay section-spacing overflow-x-clip">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <RevealSection variant="fade-up" className="mx-auto max-w-2xl text-center">
                    <p className="section-eyebrow">Popular jobs</p>
                    <h2 className="section-title-lg">Popular Jobs on TalentBridge</h2>
                    <p className="section-description md:text-lg">
                        Discover high-interest roles and flexible career paths professionals search for most often.
                    </p>
                </RevealSection>

                <StaggerReveal
                    variant="fade-up"
                    staggerMs={90}
                    className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {popularJobs.map((job) => (
                        <Link
                            key={job.title}
                            to={PUBLIC_PATHS.jobs}
                            className="group flex h-full min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevation-2 transition-[border-color,box-shadow] duration-500 hover:border-gold/30 hover:shadow-elevation-3 sm:min-h-[24rem]"
                        >
                            <div className="relative h-36 shrink-0 overflow-hidden md:h-40">
                                <img
                                    src={job.image}
                                    alt=""
                                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                            </div>

                            <div className="flex flex-1 flex-col p-6 md:p-7">
                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-gold">
                                    <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} />
                                    {job.category}
                                </span>
                                <h3 className="mt-5 font-display text-xl font-medium leading-snug text-foreground transition-colors group-hover:text-gold md:text-2xl">
                                    {job.title}
                                </h3>
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                                    {job.description}
                                </p>
                                <div className="mt-6 space-y-2.5 border-t border-border/60 pt-5 text-sm text-foreground/80">
                                    <div className="flex items-center gap-2.5">
                                        <Tag className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
                                        <span>{job.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <MapPin className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
                                        <span>{job.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </StaggerReveal>
            </div>
        </section>
    );
}
