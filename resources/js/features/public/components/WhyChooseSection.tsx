import { BadgeCheck, Briefcase, Search, Sparkles, Target, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { RevealSection } from '@/components/common/RevealSection';

const reasons: { icon: LucideIcon; title: string; description: string; layout: 'left' | 'right' }[] = [
    {
        icon: Search,
        title: 'Intelligent job discovery',
        description:
            'Personalized recommendations match your skills, experience, and preferences to opportunities that actually fit.',
        layout: 'left',
    },
    {
        icon: BadgeCheck,
        title: 'Verified employers only',
        description:
            'Every company undergoes verification. Apply with confidence knowing who is on the other side.',
        layout: 'right',
    },
    {
        icon: Target,
        title: 'End-to-end visibility',
        description:
            'From first application to final offer — track every milestone in a workspace designed for clarity.',
        layout: 'left',
    },
    {
        icon: Sparkles,
        title: 'Professional resume builder',
        description:
            'Create polished, ATS-friendly resumes with templates crafted for modern hiring standards.',
        layout: 'right',
    },
    {
        icon: Briefcase,
        title: 'Employer-grade tools',
        description:
            'Hiring teams get pipeline management, interview scheduling, and analytics without CRM complexity.',
        layout: 'left',
    },
    {
        icon: Zap,
        title: 'Built for speed',
        description:
            'Instant search, real-time status updates, and one-click applications. No friction, no waiting.',
        layout: 'right',
    },
];

const accentStyles = [
    'bg-secondary/10 text-secondary group-hover:bg-secondary/15',
    'bg-accent-subtle text-accent-purple group-hover:bg-accent-subtle',
    'bg-highlight/10 text-highlight group-hover:bg-highlight/15',
];

export function WhyChooseSection() {
    return (
        <section className="overflow-x-clip">
            <div className="landing-section-alt py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight">Why TalentBridge</p>
                        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl lg:text-[2.65rem]">
                            Recruitment,{' '}
                            <span className="font-normal italic text-gold">reimagined</span>
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                            A platform built for people who take their careers — and their hiring — seriously.
                        </p>
                    </div>
                </div>
            </div>

            <div className="surface-navy grain-overlay py-12 md:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                    <div className="space-y-4">
                        {reasons.map((item, i) => (
                            <RevealSection
                                key={item.title}
                                variant={i % 2 === 0 ? 'slide-left' : 'slide-right'}
                                delay={i * 90}
                            >
                                <div
                                    className={`group card-glow-hover flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-7 dark:border-border/80 md:flex-row md:items-center md:gap-10 md:p-8 ${
                                        item.layout === 'right' ? 'md:flex-row-reverse' : ''
                                    }`}
                                >
                                    <div
                                        className={`journey-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-400 ${accentStyles[i % 3]}`}
                                    >
                                        <item.icon
                                            className="h-6 w-6 transition-transform duration-400 group-hover:scale-110"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <div className={item.layout === 'right' ? 'md:text-right' : ''}>
                                        <h3 className="font-display text-xl font-medium md:text-[1.375rem]">{item.title}</h3>
                                        <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] md:leading-[1.75]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
