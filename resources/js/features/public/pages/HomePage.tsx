import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealSection } from '@/components/common/RevealSection';
import { GlobalJobSearch } from '@/features/public/components/GlobalJobSearch';
import { FeaturedJobsSection } from '@/features/public/components/FeaturedJobsSection';
import { CategoriesSection } from '@/features/public/components/CategoriesSection';
import { LocationsSection } from '@/features/public/components/LocationsSection';
import { WhyChooseSection } from '@/features/public/components/WhyChooseSection';
import { PlatformStatsSection } from '@/features/public/components/PlatformStatsSection';
import { TrustIndicatorsSection } from '@/features/public/components/TrustIndicatorsSection';
import { TestimonialsSection } from '@/features/public/components/TestimonialsSection';
import { HiringProcessSection } from '@/features/public/components/HiringProcessSection';
import { CTASection } from '@/features/public/components/CTASection';
import { PUBLIC_PATHS } from '@/lib/paths';

export function HomePage() {
    return (
        <div className="min-w-0 max-w-full overflow-x-hidden">
            <section className="landing-section-hero relative -mt-[4.5rem] overflow-hidden pt-[calc(4.5rem+2.5rem)] md:pt-[calc(4.5rem+3.5rem)]">
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[hsl(230_44%_15%_/_0.07)] to-transparent dark:from-[hsl(230_32%_8%_/_0.35)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_68%_-5%,_hsl(42_42%_86%_/_0.65)_0%,_transparent_58%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_68%_-5%,_hsl(42_22%_20%_/_0.28)_0%,_transparent_58%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                <div className="relative mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24 lg:px-8">
                    <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
                        <div className="min-w-0 space-y-5 md:space-y-6">
                            <RevealSection variant="slide-left">
                                <p className="inline-flex items-center gap-3 font-display text-sm font-medium tracking-wide text-gold md:text-base md:tracking-[0.06em]">
                                    <span className="h-px w-10 bg-gold/50" />
                                    Global recruitment platform
                                </p>
                            </RevealSection>

                            <RevealSection variant="fade-up" delay={80}>
                                <h1 className="font-display text-[2.25rem] font-medium leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] lg:leading-[1.06] xl:text-[4.25rem]">
                                    Find Your Next Career Opportunity With{' '}
                                    <span className="font-normal italic text-gold">Confidence</span>
                                </h1>
                            </RevealSection>

                            <RevealSection variant="fade-up" delay={160}>
                                <p className="max-w-[34rem] text-base font-normal leading-[1.7] text-muted-foreground md:text-lg">
                                    TalentBridge is the premium hiring platform for professionals who expect more — and
                                    teams who refuse to settle for ordinary recruitment tools.
                                </p>
                            </RevealSection>

                            <RevealSection variant="fade-up" delay={240}>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="btn-magnetic rounded-lg bg-highlight px-6 text-highlight-foreground hover:bg-highlight/90 sm:px-8"
                                    >
                                        <Link to={PUBLIC_PATHS.jobs}>
                                            Explore opportunities
                                            <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        asChild
                                        className="btn-magnetic rounded-lg px-6 sm:px-8"
                                    >
                                        <Link to={PUBLIC_PATHS.register}>
                                            For employers
                                            <ArrowUpRight className="ml-1.5 h-4 w-4 shrink-0" />
                                        </Link>
                                    </Button>
                                </div>
                            </RevealSection>

                            <RevealSection variant="fade-up" delay={320}>
                                <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-6 sm:gap-6 sm:pt-7">
                                    {[
                                        { value: '50K+', label: 'Active seekers' },
                                        { value: '2,500+', label: 'Verified companies' },
                                        { value: '45+', label: 'Countries' },
                                    ].map((item) => (
                                        <div key={item.label} className="min-w-0">
                                            <p className="truncate font-display text-lg font-medium text-foreground sm:text-xl md:text-2xl">
                                                {item.value}
                                            </p>
                                            <p className="mt-0.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </RevealSection>
                        </div>

                        <RevealSection variant="slide-right" delay={120} className="relative hidden min-w-0 lg:block">
                            <div className="relative">
                                <div className="relative rounded-2xl border border-border/60 shadow-elevation-4">
                                    <div className="overflow-hidden rounded-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=960&q=85"
                                            alt="Professional team in a modern workspace collaborating"
                                            className="aspect-[5/6] w-full object-cover object-[center_20%] transition-transform duration-700 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
                                            loading="eager"
                                        />
                                    </div>
                                    <div className="absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-lg border border-gold/30 bg-card/95 px-4 py-2.5 shadow-elevation-2 backdrop-blur-md sm:right-4 sm:top-4 sm:px-5 sm:py-3">
                                        <p className="font-display text-[0.6875rem] font-medium uppercase leading-tight tracking-[0.1em] text-gold sm:text-xs sm:tracking-[0.12em]">
                                            Now hiring globally
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] animate-float rounded-xl border border-border/60 bg-card p-4 shadow-elevation-3 motion-reduce:animate-none sm:bottom-4 sm:left-4 sm:p-5">
                                    <p className="font-display text-2xl font-medium text-gold md:text-3xl">18K+</p>
                                    <p className="mt-0.5 text-sm text-muted-foreground">Successful placements worldwide</p>
                                </div>
                            </div>
                        </RevealSection>
                    </div>

                    <RevealSection variant="scale" delay={400} className="mt-10 min-w-0 lg:mt-14">
                        <GlobalJobSearch variant="hero" />
                    </RevealSection>
                </div>
            </section>

            <PlatformStatsSection />
            <TrustIndicatorsSection />

            <FeaturedJobsSection />

            <CategoriesSection />
            <LocationsSection />
            <WhyChooseSection />
            <HiringProcessSection />
            <TestimonialsSection />

            <CTASection />
            <CTASection variant="employer" />
        </div>
    );
}
