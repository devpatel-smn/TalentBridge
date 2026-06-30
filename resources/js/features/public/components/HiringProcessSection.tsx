import { useEffect, useRef, useState } from 'react';
import { FileText, MessageSquare, Search, Trophy } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

const stepIconClass = 'border-gold/35 text-gold';
const stepIconBg = 'bg-surface-sunken dark:bg-card';

const steps = [
    {
        step: '01',
        icon: Search,
        title: 'Discover',
        description: 'Search thousands of roles or receive matches tailored to your unique profile and ambitions.',
    },
    {
        step: '02',
        icon: FileText,
        title: 'Apply',
        description: 'Submit polished applications in seconds. Every submission tracked in real time.',
    },
    {
        step: '03',
        icon: MessageSquare,
        title: 'Interview',
        description: 'Schedule, accept, or reschedule interviews seamlessly — all from one workspace.',
    },
    {
        step: '04',
        icon: Trophy,
        title: 'Get hired',
        description: 'Receive offers with full visibility into your journey. Celebrate your next chapter.',
    },
];

export function HiringProcessSection() {
    const reducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(reducedMotion ? steps.length : 0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (reducedMotion) return;

        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let i = 0;
                    const interval = setInterval(() => {
                        i += 1;
                        setVisibleCount(i);
                        if (i >= steps.length) clearInterval(interval);
                    }, 280);
                    observer.disconnect();
                    return () => clearInterval(interval);
                }
            },
            { threshold: 0.25 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [reducedMotion]);

    const progressStep = Math.max(visibleCount, activeIndex + 1);

    return (
        <section ref={sectionRef} className="landing-section-alt grain-overlay section-spacing overflow-x-clip">
            <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="max-w-xl">
                    <p className="section-eyebrow">The journey</p>
                    <h2 className="section-title">Your path to the perfect role</h2>
                    <p className="section-description">
                        A streamlined hiring experience designed for clarity at every step.
                    </p>
                </div>

                <div className="relative mt-10 md:mt-12">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {steps.map((item, index) => {
                            const isActive = index === activeIndex;
                            const isVisible = index < visibleCount;
                            const segmentActive = index < progressStep - 1;

                            return (
                                <div
                                    key={item.step}
                                    className={cn(
                                        'journey-step relative lg:text-center',
                                        !reducedMotion && !isVisible && 'translate-y-4 opacity-0',
                                        !reducedMotion && isVisible && 'translate-y-0 opacity-100 transition-all duration-500',
                                    )}
                                    style={!reducedMotion ? { transitionDelay: `${index * 120}ms` } : undefined}
                                    data-active={isActive}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onFocus={() => setActiveIndex(index)}
                                >
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                'timeline-line-progress pointer-events-none absolute top-8 z-0 hidden h-0.5 lg:block',
                                                segmentActive ? 'opacity-100' : 'opacity-60',
                                            )}
                                            style={{
                                                left: 'calc(50% + 2rem)',
                                                width: 'calc(100% - 4rem + 1.5rem)',
                                            }}
                                            aria-hidden
                                        />
                                    )}

                                    <div className="relative z-10 flex gap-5 lg:flex-col lg:items-center lg:gap-0">
                                        <div
                                            className={cn(
                                                'journey-icon relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 lg:mx-auto',
                                                stepIconClass,
                                                stepIconBg,
                                                isActive && 'border-gold/60 shadow-[0_0_24px_-4px_hsl(var(--gold)/0.35)]',
                                            )}
                                        >
                                            <item.icon className="h-6 w-6" strokeWidth={1.5} fill="none" />
                                        </div>
                                        <div className="lg:mt-5">
                                            <span className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-gold">
                                                Step {item.step}
                                            </span>
                                            <h3
                                                className={cn(
                                                    'mt-1.5 font-display text-lg font-medium transition-colors duration-300 md:text-xl',
                                                    isActive && 'text-gold',
                                                )}
                                            >
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
