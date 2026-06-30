import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealSection } from '@/components/common/RevealSection';
import { PUBLIC_PATHS } from '@/lib/paths';

interface CTASectionProps {
    variant?: 'default' | 'employer';
}

export function CTASection({ variant = 'default' }: CTASectionProps) {
    const isEmployer = variant === 'employer';

    if (isEmployer) {
        return (
            <RevealSection variant="slide-right">
                <section className="section-spacing pb-16 md:pb-20">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                        <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-border/60 bg-card lg:grid-cols-2 lg:gap-10 lg:p-6">
                            <div className="relative hidden overflow-hidden rounded-xl lg:block">
                                <img
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                                    alt="Hiring team reviewing candidates in a meeting"
                                    className="h-full min-h-[360px] w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                            </div>
                            <div className="p-7 md:p-9 lg:px-8 lg:py-8">
                                <div className="inline-flex items-center gap-2 rounded-md bg-highlight/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-highlight">
                                    <Users className="h-3.5 w-3.5" />
                                    For hiring teams
                                </div>
                                <h2 className="mt-5 font-display text-3xl font-medium tracking-tight md:text-4xl">
                                    Hire exceptional talent, faster
                                </h2>
                                <p className="mt-4 section-description">
                                    Post jobs, manage applicants, and build your dream team with premium employer tools
                                    designed for modern hiring teams.
                                </p>
                                <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
                                    {['Verified candidate pipeline', 'Interview scheduling', 'Hiring analytics'].map(
                                        (item) => (
                                            <li key={item} className="flex items-center gap-2.5">
                                                <span className="h-1 w-1 rounded-full bg-highlight" />
                                                {item}
                                            </li>
                                        ),
                                    )}
                                </ul>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="w-full rounded-lg bg-highlight text-highlight-foreground hover:bg-highlight/90 sm:w-auto"
                                    >
                                        <Link to={PUBLIC_PATHS.register} className="inline-flex items-center justify-center">
                                            Post a job
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild className="w-full rounded-lg sm:w-auto">
                                        <Link to={PUBLIC_PATHS.register} className="inline-flex items-center justify-center">
                                            Create employer account
                                        </Link>
                                    </Button>
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
            <section className="section-spacing">
                <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                    <div className="surface-navy grain-overlay relative overflow-hidden rounded-2xl px-8 py-10 md:px-12 md:py-14">
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-highlight/10 to-transparent" />
                        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    For job seekers
                                </div>
                                <h2 className="section-title-on-dark mt-5">
                                    Your next chapter starts here
                                </h2>
                                <p className="section-description mt-4 max-w-lg text-on-dark-muted">
                                    Join thousands of professionals who discovered their next role through personalized
                                    matching and seamless applications.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="rounded-lg bg-highlight text-highlight-foreground hover:bg-highlight/90"
                                    >
                                        <Link to={PUBLIC_PATHS.jobs}>
                                            Browse jobs
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        asChild
                                        className="btn-on-dark-outline rounded-lg"
                                    >
                                        <Link to={PUBLIC_PATHS.register}>Create free account</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden rounded-xl border border-white/10 bg-white/5 p-8 lg:block">
                                <p className="font-display text-5xl font-medium text-gold">18K+</p>
                                <p className="mt-2 text-sm text-on-dark-subtle">Successful placements worldwide</p>
                                <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-on-dark-muted">
                                    {['Smart job matching', 'Application tracking', 'Resume builder'].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                            <span className="h-1 w-1 rounded-full bg-gold" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </RevealSection>
    );
}
