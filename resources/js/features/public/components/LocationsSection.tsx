import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { RevealSection, StaggerReveal } from '@/components/common/RevealSection';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import { PUBLIC_PATHS } from '@/lib/paths';

const locations = [
    { city: 'San Francisco', country: 'USA', flag: '🇺🇸', count: '2,400+', image: IMAGES.locations.sanFrancisco, alt: 'San Francisco skyline' },
    { city: 'New York', country: 'USA', flag: '🇺🇸', count: '3,100+', image: IMAGES.locations.newYork, alt: 'New York cityscape' },
    { city: 'London', country: 'UK', flag: '🇬🇧', count: '1,800+', image: IMAGES.locations.london, alt: 'London cityscape' },
    { city: 'Berlin', country: 'Germany', flag: '🇩🇪', count: '950+', image: IMAGES.locations.berlin, alt: 'Berlin cityscape' },
    { city: 'Toronto', country: 'Canada', flag: '🇨🇦', count: '820+', image: IMAGES.locations.toronto, alt: 'Toronto cityscape' },
    { city: 'Sydney', country: 'Australia', flag: '🇦🇺', count: '720+', image: IMAGES.locations.sydney, alt: 'Sydney harbour' },
    { city: 'Dubai', country: 'UAE', flag: '🇦🇪', count: '540+', image: IMAGES.locations.dubai, alt: 'Dubai skyline' },
    { city: 'Remote', country: 'Worldwide', flag: '🌐', count: '5,200+', image: IMAGES.locations.remote, alt: 'Remote work setup' },
];

function LocationCard({ loc, priority }: { loc: (typeof locations)[number]; priority?: boolean }) {
    return (
        <Link
            to={`${PUBLIC_PATHS.jobs}?location=${encodeURIComponent(loc.city)}`}
            className="landing-card group relative flex min-h-[11rem] flex-col justify-end overflow-hidden p-5 md:min-h-[12rem] md:p-6"
        >
            <OptimizedImage
                src={loc.image}
                alt={loc.alt}
                priority={priority}
                wrapperClassName="absolute inset-0"
                className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-navy/55 transition-colors duration-400 group-hover:bg-navy/65" />

            <div className="relative">
                <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden>
                        {loc.flag}
                    </span>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-gold">
                        {loc.count} roles
                    </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-medium text-white md:text-2xl">{loc.city}</h3>
                <p className="mt-0.5 text-sm text-white/65">{loc.country}</p>
            </div>
        </Link>
    );
}

export function LocationsSection() {
    return (
        <section data-section-tone="light" className="landing-section-canvas section-spacing overflow-x-clip">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <RevealSection variant="fade-up" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <p className="section-eyebrow">Browse by location</p>
                        <h2 className="section-title-lg">Where talent thrives</h2>
                        <p className="section-description">
                            Popular hiring hubs and remote-first opportunities across the globe.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="w-fit shrink-0 rounded-xl">
                        <Link to={PUBLIC_PATHS.jobs}>
                            Search by location
                            <MapPin className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </RevealSection>

                <StaggerReveal
                    variant="fade-up"
                    staggerMs={50}
                    className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {locations.map((loc, index) => (
                        <LocationCard key={loc.city} loc={loc} priority={index < 4} />
                    ))}
                </StaggerReveal>

                <p className="mt-8 text-center">
                    <Link
                        to={PUBLIC_PATHS.jobs}
                        className={cn(
                            'inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-gold/80',
                        )}
                    >
                        Explore all locations
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </p>
            </div>
        </section>
    );
}
