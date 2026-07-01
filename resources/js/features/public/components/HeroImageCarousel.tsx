import { ImageCarousel } from '@/components/common/ImageCarousel';
import { IMAGES } from '@/lib/images';

const heroSlides = [
    {
        src: IMAGES.hero.professional,
        alt: 'Professional woman smiling in a modern workplace',
    },
    {
        src: IMAGES.hero.teamCollaboration,
        alt: 'Recruitment team collaborating in a modern office',
    },
    {
        src: IMAGES.hero.hrMeeting,
        alt: 'HR professionals leading a hiring strategy meeting',
    },
    {
        src: IMAGES.hero.jobInterview,
        alt: 'Employer conducting a professional job interview',
    },
    {
        src: IMAGES.hero.modernWorkplace,
        alt: 'Modern workplace designed for team collaboration',
    },
    {
        src: IMAGES.hero.hiringReview,
        alt: 'Hiring managers reviewing candidates together',
    },
];

export function HeroImageCarousel() {
    return (
        <div className="relative w-full">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-elevation-2">
                <ImageCarousel
                    slides={heroSlides}
                    intervalMs={2500}
                    showIndicators={false}
                    imageClassName="aspect-[4/5] w-full sm:aspect-[5/6] lg:max-h-[560px]"
                />
            </div>
        </div>
    );
}
