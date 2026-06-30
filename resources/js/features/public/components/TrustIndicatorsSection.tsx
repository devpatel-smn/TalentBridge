import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, Building2, Globe2, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { RevealSection, StaggerReveal } from '@/components/common/RevealSection';

const trustPillars = [
    {
        icon: ShieldCheck,
        title: 'Verified employers',
        description: 'Every company passes verification before posting roles to our platform.',
    },
    {
        icon: TrendingUp,
        title: 'Proven outcomes',
        description: 'Thousands of successful placements across technology, finance, and healthcare.',
    },
    {
        icon: Globe2,
        title: 'Global reach',
        description: 'Hire and get hired across 45+ countries with remote-first opportunities.',
    },
];

export function TrustIndicatorsSection() {
    const { data } = useQuery({
        queryKey: ['jobs', 'trust-stats'],
        queryFn: () => jobsApi.list({ per_page: 1 }),
    });

    const openPositions = data?.meta?.pagination?.total;

    return (
        <section className="landing-section-alt section-spacing">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-12">
                    <RevealSection variant="slide-left" className="lg:pl-3">
                        <p className="section-eyebrow">Platform trust</p>
                        <h2 className="section-title">
                            Why companies choose{' '}
                            <span className="text-accent-gold">TalentBridge</span>
                        </h2>
                        <p className="section-description max-w-md">
                            Enterprise-grade recruitment infrastructure trusted by hiring teams and professionals
                            worldwide.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy dark:bg-gold/10 dark:text-gold">
                                    <Building2 className="h-5 w-5" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="font-display text-xl font-medium">2,500+</p>
                                    <p className="text-xs text-muted-foreground">Verified companies</p>
                                </div>
                            </div>
                            {openPositions != null && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-highlight/10 text-highlight">
                                        <Users className="h-5 w-5" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="font-display text-xl font-medium">
                                            {openPositions.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Open positions now</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </RevealSection>

                    <StaggerReveal
                        variant="fade-up"
                        staggerMs={100}
                        className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1"
                    >
                        {trustPillars.map((pillar) => (
                            <div
                                key={pillar.title}
                                className="card-glow-hover flex gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-elevation-1 md:p-5"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                    <pillar.icon className="h-5 w-5" strokeWidth={1.5} />
                                </div>
                                <div className="min-w-0 lg:pl-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{pillar.title}</h3>
                                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-gold" />
                                    </div>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                        {pillar.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </StaggerReveal>
                </div>
            </div>
        </section>
    );
}
