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
    'bg-gold/12 text-gold group-hover:bg-gold/18',
    'bg-highlight/12 text-highlight group-hover:bg-highlight/18',
    'bg-white/10 text-white group-hover:bg-white/14',
];

export function WhyChooseSection() {
    return (
        <section className="surface-navy grain-overlay section-spacing overflow-x-clip">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="section-eyebrow">Why TalentBridge</p>
                    <h2 className="section-title-on-dark">
                        Recruitment, <span className="font-normal italic text-gold">reimagined</span>
                    </h2>
                    <p className="section-description text-on-dark-muted md:text-lg">
                        A platform built for people who take their careers — and their hiring — seriously.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {reasons.map((item, i) => (
                        <RevealSection
                            key={item.title}
                            variant={i % 2 === 0 ? 'slide-left' : 'slide-right'}
                            delay={i * 90}
                            className="h-full"
                        >
                            <div className="card-on-navy group flex h-full flex-col p-7 md:p-8">
                                <div
                                    className={`journey-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-400 ${accentStyles[i % 3]}`}
                                >
                                    <item.icon
                                        className="h-6 w-6 transition-transform duration-400 group-hover:scale-110"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="mt-6">
                                    <h3 className="font-display text-xl font-medium text-white md:text-[1.375rem]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-relaxed text-on-dark-muted md:text-[0.9375rem] md:leading-[1.72]">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </RevealSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
