import { ImageCarousel } from '@/components/common/ImageCarousel';

const imageParams = 'w=960&q=90&auto=format&fit=crop';

const heroSlides = [
    {
        src: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?${imageParams}`,
        alt: 'Recruitment team collaborating in a modern office',
    },
    {
        src: `https://images.unsplash.com/photo-1542744173-8e7e53415bb0?${imageParams}`,
        alt: 'HR professionals leading a hiring strategy meeting',
    },
    {
        src: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?${imageParams}`,
        alt: 'Employer conducting a professional job interview',
    },
    {
        src: `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?${imageParams}`,
        alt: 'Job seeker in a career consultation session',
    },
    {
        src: `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${imageParams}`,
        alt: 'Modern workplace designed for team collaboration',
    },
    {
        src: `https://images.unsplash.com/photo-1553877522-43269d4ea984?${imageParams}`,
        alt: 'Hiring managers reviewing candidates together',
    },
];

export function HeroImageCarousel() {
    return (
        <div className="relative">
            <div className="relative rounded-2xl border border-border/60 shadow-elevation-4">
                <ImageCarousel
                    slides={heroSlides}
                    intervalMs={2500}
                    showIndicators={false}
                    imageClassName="aspect-[4/3] max-h-[min(280px,42vw)] w-full object-cover object-[center_20%] sm:aspect-[16/11] sm:max-h-[min(340px,48vw)] md:max-h-[min(380px,44vw)] lg:aspect-[5/6] lg:max-h-none"
                    overlay={
                        <>
                            <div className="absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-lg border border-gold/30 bg-card/95 px-4 py-2.5 shadow-elevation-2 backdrop-blur-md sm:right-4 sm:top-4 sm:px-5 sm:py-3">
                                <p className="font-display text-[0.6875rem] font-medium uppercase leading-tight tracking-[0.1em] text-gold sm:text-xs sm:tracking-[0.12em]">
                                    Now hiring globally
                                </p>
                            </div>
                            <div className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] animate-float rounded-xl border border-border/60 bg-card p-4 shadow-elevation-3 motion-reduce:animate-none sm:bottom-4 sm:left-4 sm:p-5">
                                <p className="font-display text-2xl font-medium text-gold md:text-3xl">18K+</p>
                                <p className="mt-0.5 text-sm text-muted-foreground">Successful placements worldwide</p>
                            </div>
                        </>
                    }
                />
            </div>
        </div>
    );
}
