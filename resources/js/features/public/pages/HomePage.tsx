import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealSection } from '@/components/common/RevealSection';
import { GlobalJobSearch } from '@/features/public/components/GlobalJobSearch';
import { FeaturedJobsSection } from '@/features/public/components/FeaturedJobsSection';
import { LocationsSection } from '@/features/public/components/LocationsSection';
import { WhyChooseSection } from '@/features/public/components/WhyChooseSection';
import { PlatformStatsSection } from '@/features/public/components/PlatformStatsSection';
import { TrustIndicatorsSection } from '@/features/public/components/TrustIndicatorsSection';
import { TestimonialsSection } from '@/features/public/components/TestimonialsSection';
import { HiringProcessSection } from '@/features/public/components/HiringProcessSection';
import { CTASection } from '@/features/public/components/CTASection';
import { HeroImageCarousel } from '@/features/public/components/HeroImageCarousel';
import { PopularHiringCitiesSection } from '@/features/public/components/PopularHiringCitiesSection';
import { PopularJobsSection } from '@/features/public/components/PopularJobsSection';
import { PUBLIC_PATHS } from '@/lib/paths';

export function HomePage() {
    return (
        <div className="min-w-0 max-w-full overflow-x-hidden">
            <section className="landing-section-hero relative min-h-0 overflow-hidden pt-[calc(4.5rem+1.25rem)] sm:pt-[calc(4.5rem+1.75rem)] md:pt-[calc(4.5rem+2.5rem)]">
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[hsl(26_14%_10%_/_0.07)] to-transparent dark:from-[hsl(26_14%_8%_/_0.35)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_68%_-5%,_hsl(29_86%_80%_/_0.45)_0%,_transparent_58%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_68%_-5%,_hsl(29_84%_61%_/_0.15)_0%,_transparent_58%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:pb-12 md:px-6 md:pb-16 lg:px-8">
                    <div className="grid min-w-0 items-center gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
                        <div className="order-2 min-w-0 space-y-4 md:space-y-5 lg:order-1">
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
                                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="btn-magnetic w-full rounded-lg bg-highlight px-6 text-highlight-foreground hover:bg-highlight/90 sm:w-auto sm:px-8"
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
                                        className="btn-magnetic w-full rounded-lg px-6 sm:w-auto sm:px-8"
                                    >
                                        <Link to={PUBLIC_PATHS.register}>
                                            For employers
                                            <ArrowUpRight className="ml-1.5 h-4 w-4 shrink-0" />
                                        </Link>
                                    </Button>
                                </div>
                            </RevealSection>

                            <RevealSection variant="fade-up" delay={320}>
                                <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-5 sm:gap-4 sm:pt-7 md:gap-6">
                                    {[
                                        { value: '50K+', label: 'Active seekers' },
                                        { value: '2,500+', label: 'Verified companies' },
                                        { value: '45+', label: 'Countries' },
                                    ].map((item) => (
                                        <div key={item.label} className="min-w-0 text-center sm:text-left">
                                            <p className="font-display text-base font-medium text-foreground sm:text-xl md:text-2xl">
                                                {item.value}
                                            </p>
                                            <p className="mt-0.5 text-[0.5625rem] font-medium uppercase leading-tight tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.12em]">
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </RevealSection>
                        </div>

                        <RevealSection
                            variant="slide-right"
                            delay={120}
                            className="relative order-1 mx-auto w-full min-w-0 max-w-lg lg:order-2 lg:max-w-none"
                        >
                            <HeroImageCarousel />
                        </RevealSection>
                    </div>

                    <RevealSection variant="scale" delay={400} className="mt-8 min-w-0 lg:mt-10">
                        <GlobalJobSearch variant="hero" />
                        <PopularHiringCitiesSection />
                    </RevealSection>
                </div>
            </section>

            <PlatformStatsSection />
            <TrustIndicatorsSection />

            <FeaturedJobsSection />

            {/* <CategoriesSection /> */}
            <PopularJobsSection />
            <LocationsSection />
            <WhyChooseSection />
            <HiringProcessSection />
            <TestimonialsSection />

            <CTASection />
            <CTASection variant="employer" />
        </div>
    );
}
