import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealSection } from '@/components/common/RevealSection';
import { GlobalJobSearch } from '@/features/public/components/GlobalJobSearch';
import { HeroImageCarousel } from '@/features/public/components/HeroImageCarousel';
import { PUBLIC_PATHS } from '@/lib/paths';

export function HeroSection() {
    return (
        <section
            data-section-tone="light"
            className="landing-section-hero relative min-h-0 overflow-hidden pt-[calc(4.5rem+1.25rem)] sm:pt-[calc(4.5rem+2rem)] md:pt-[calc(4.5rem+2.5rem)] lg:pt-[calc(4.5rem+3rem)]"
        >
            <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:pb-12 md:px-6 md:pb-16 lg:px-8 lg:pb-20">
                <div className="grid min-w-0 items-center gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-16">
                    <div className="order-1 min-w-0 space-y-4 sm:space-y-5 md:space-y-6">
                        <RevealSection variant="slide-left">
                            <p className="section-eyebrow">Premium recruitment marketplace</p>
                        </RevealSection>

                        <RevealSection variant="fade-up" delay={80}>
                            <h1 className="hero-title">
                                Where exceptional talent meets{' '}
                                <span className="text-gold">exceptional teams</span>
                            </h1>
                        </RevealSection>

                        <RevealSection variant="fade-up" delay={160}>
                            <p className="max-w-[36rem] text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.75]">
                                TalentBridge connects ambitious professionals and forward-thinking employers
                                through a premium hiring experience built for both sides of the marketplace.
                            </p>
                        </RevealSection>

                        <RevealSection variant="fade-up" delay={240}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                <Button
                                    size="lg"
                                    variant="gold"
                                    asChild
                                    className="w-full sm:w-auto"
                                >
                                    <Link to={PUBLIC_PATHS.jobs}>
                                        Find your next role
                                        <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="w-full sm:w-auto"
                                >
                                    <Link to={PUBLIC_PATHS.register}>
                                        Hire top talent
                                        <ArrowUpRight className="ml-2 h-4 w-4 shrink-0" />
                                    </Link>
                                </Button>
                            </div>
                        </RevealSection>
                    </div>

                    <RevealSection
                        variant="slide-right"
                        delay={120}
                        className="relative order-2 mx-auto w-full min-w-0 max-w-lg lg:max-w-none"
                    >
                        <HeroImageCarousel />
                    </RevealSection>
                </div>

                <RevealSection variant="scale" delay={280} className="mt-6 min-w-0 sm:mt-8 md:mt-12 lg:mt-14">
                    <GlobalJobSearch variant="hero" />
                </RevealSection>
            </div>
        </section>
    );
}
