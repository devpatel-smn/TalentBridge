import { BadgeCheck, Briefcase, Search, Sparkles, Target, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { RevealSection } from '@/components/common/RevealSection';
import { cn } from '@/lib/utils';

interface Reason {
    icon: LucideIcon;
    title: string;
    description: string;
    variant: 'featured' | 'standard' | 'compact';
}

const reasons: Reason[] = [
    {
        icon: Search,
        title: 'Intelligent job discovery',
        description:
            'Personalized recommendations match your skills, experience, and preferences to opportunities that actually fit.',
        variant: 'featured',
    },
    {
        icon: BadgeCheck,
        title: 'Verified employers only',
        description:
            'Every company undergoes verification. Apply with confidence knowing who is on the other side.',
        variant: 'standard',
    },
    {
        icon: Target,
        title: 'End-to-end visibility',
        description:
            'From first application to final offer — track every milestone in a workspace designed for clarity.',
        variant: 'standard',
    },
    {
        icon: Sparkles,
        title: 'Professional resume builder',
        description:
            'Create polished, ATS-friendly resumes with templates crafted for modern hiring standards.',
        variant: 'standard',
    },
    {
        icon: Briefcase,
        title: 'Employer-grade tools',
        description:
            'Hiring teams get pipeline management, interview scheduling, and analytics without CRM complexity.',
        variant: 'featured',
    },
    {
        icon: Zap,
        title: 'Built for speed',
        description:
            'Instant search, real-time status updates, and one-click applications. No friction, no waiting.',
        variant: 'standard',
    },
];

const iconAccents = [
    'bg-gold/12 text-gold border-gold/20 group-hover:bg-gold/18 group-hover:border-gold/35',
    'bg-white/10 text-gold border-white/15 group-hover:bg-white/14 group-hover:border-gold/25',
    'bg-highlight/12 text-highlight border-highlight/20 group-hover:bg-highlight/18 group-hover:border-highlight/35',
];

function ReasonCard({ item, index }: { item: Reason; index: number }) {
    const isFeatured = item.variant === 'featured';
    const isCompact = item.variant === 'compact';

    return (
        <div
            className={cn(
                'card-on-navy group flex h-full flex-col p-7 transition-all duration-400',
                isFeatured && 'md:col-span-2 md:flex-row md:items-start md:gap-8 md:p-9',
                !isFeatured && 'md:p-8',
                isCompact && 'md:p-6',
            )}
        >
            <div
                className={cn(
                    'journey-icon flex shrink-0 items-center justify-center rounded-2xl border transition-all duration-400',
                    iconAccents[index % iconAccents.length],
                    isFeatured ? 'h-14 w-14 md:h-16 md:w-16' : isCompact ? 'h-12 w-12' : 'h-14 w-14',
                )}
            >
                <item.icon
                    className={cn(
                        'transition-transform duration-400 group-hover:scale-110',
                        isFeatured ? 'h-6 w-6 md:h-7 md:w-7' : isCompact ? 'h-5 w-5' : 'h-6 w-6',
                    )}
                    strokeWidth={1.5}
                />
            </div>
            <div className={cn('mt-6', isFeatured && 'md:mt-0 md:flex-1')}>
                <h3
                    className={cn(
                        'font-display font-medium text-white',
                        isFeatured ? 'text-2xl md:text-[1.625rem]' : isCompact ? 'text-lg' : 'text-xl md:text-[1.375rem]',
                    )}
                >
                    {item.title}
                </h3>
                <p
                    className={cn(
                        'mt-2.5 leading-relaxed text-on-dark-muted',
                        isFeatured ? 'text-base md:max-w-lg md:text-[0.9375rem] md:leading-[1.72]' : 'text-sm md:text-[0.9375rem] md:leading-[1.72]',
                    )}
                >
                    {item.description}
                </p>
            </div>
        </div>
    );
}

export function WhyChooseSection() {
    return (
        <section data-section-tone="dark" className="surface-navy grain-overlay section-spacing overflow-x-clip">
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

                <div className="mt-12 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {reasons.map((item, i) => (
                        <RevealSection
                            key={item.title}
                            variant={i % 2 === 0 ? 'slide-left' : 'slide-right'}
                            delay={i * 80}
                            className={cn(
                                'h-full',
                                item.variant === 'featured' && 'md:col-span-2',
                            )}
                        >
                            <ReasonCard item={item} index={i} />
                        </RevealSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
