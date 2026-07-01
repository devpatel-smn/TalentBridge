import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Briefcase, Calendar, Search, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { RevealSection } from '@/components/common/RevealSection';
import { useJobCount } from '@/features/public/hooks/useHomepageJobs';
import { IMAGES } from '@/lib/images';
import { PUBLIC_PATHS } from '@/lib/paths';

interface CTASectionProps {
    variant?: 'default' | 'employer';
}

export function CTASection({ variant = 'default' }: CTASectionProps) {
    const { total } = useJobCount();
    const placementStat = total != null && total > 0 ? `${Math.max(total, 1000).toLocaleString()}+` : '18K+';

    if (variant === 'employer') {
        return (
            <RevealSection variant="slide-right">
                <section data-section-tone="light" className="section-spacing overflow-x-clip bg-surface-sunken pb-16 md:pb-20">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-2xl border border-border/60 bg-navy text-white shadow-elevation-2">
                            <div className="grid items-stretch lg:grid-cols-2">
                                <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
                                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
                                        <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                                        For hiring teams
                                    </div>
                                    <h2 className="mt-6 font-display text-3xl font-medium tracking-tight md:text-4xl lg:text-[2.5rem] lg:leading-[1.12]">
                                        Build your team with confidence
                                    </h2>
                                    <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                                        Enterprise-grade hiring tools — post roles, manage pipelines, and close offers
                                        faster without CRM complexity.
                                    </p>
                                    <ul className="mt-8 space-y-3">
                                        {[
                                            { icon: Search, text: 'Verified candidate pipeline' },
                                            { icon: Calendar, text: 'Interview scheduling' },
                                            { icon: BarChart3, text: 'Hiring analytics & insights' },
                                        ].map(({ icon: Icon, text }) => (
                                            <li key={text} className="flex items-center gap-3 text-sm text-white/80">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/6">
                                                    <Icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
                                                </span>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                        <Button size="lg" variant="gold" asChild className="w-full sm:w-auto">
                                            <Link to={PUBLIC_PATHS.register}>
                                                Post a job
                                                <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            asChild
                                            className="w-full rounded-xl border-white/25 bg-transparent text-white hover:bg-white/8 hover:text-white sm:w-auto"
                                        >
                                            <Link to={PUBLIC_PATHS.contact}>Talk to sales</Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative min-h-[16rem] lg:min-h-[26rem]">
                                    <OptimizedImage
                                        src={IMAGES.cta.hiringTeam}
                                        alt="Hiring team collaborating in a modern office"
                                        wrapperClassName="absolute inset-0"
                                        priority
                                        className="object-center"
                                    />
                                    <div className="absolute inset-0 bg-navy/35 lg:bg-navy/25" />
                                    <div className="absolute bottom-6 right-6 rounded-2xl border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                                        <p className="font-display text-3xl font-medium text-gold">3×</p>
                                        <p className="mt-1 text-sm text-white/75">Faster time-to-hire on average</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </RevealSection>
        );
    }

    return (
        <RevealSection variant="slide-left">
            <section data-section-tone="light" className="section-spacing overflow-x-clip bg-background">
                <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevation-2">
                        <div className="grid items-stretch lg:grid-cols-2">
                            <div className="relative order-2 min-h-[16rem] sm:min-h-[18rem] lg:order-1 lg:min-h-[24rem]">
                                <OptimizedImage
                                    src={IMAGES.cta.jobSeeker}
                                    alt="Professional ready for their next career move"
                                    wrapperClassName="absolute inset-0"
                                    priority
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-card/10 lg:bg-transparent" />
                            </div>
                            <div className="order-1 flex flex-col justify-center p-8 md:p-10 lg:order-2 lg:p-12">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/25 bg-gold/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
                                    <Briefcase className="h-3.5 w-3.5" strokeWidth={1.5} />
                                    For job seekers
                                </div>
                                <h2 className="mt-6 font-display text-[1.875rem] font-medium leading-[1.2] tracking-tight text-foreground md:text-4xl lg:text-[2.5rem] lg:leading-[1.12]">
                                    <span className="block md:inline">Your next chapter</span>{' '}
                                    <span className="block md:inline">starts here</span>
                                </h2>
                                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                                    Join thousands of professionals who found their next role through personalized
                                    matching, one-click applications, and full visibility.
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-gold">
                                    <Sparkles className="h-5 w-5" strokeWidth={1.5} />
                                    <span className="text-sm font-medium">{placementStat} open opportunities</span>
                                </div>
                                <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
                                    {['Smart job matching', 'Application tracking', 'Resume builder'].map((item) => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button size="lg" variant="gold" asChild className="w-full sm:w-auto">
                                        <Link to={PUBLIC_PATHS.jobs}>
                                            Browse jobs
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild className="w-full rounded-xl sm:w-auto">
                                        <Link to={PUBLIC_PATHS.register}>Create free account</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </RevealSection>
    );
}
