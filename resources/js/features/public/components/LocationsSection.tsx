import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { PUBLIC_PATHS } from '@/lib/paths';
import { cn } from '@/lib/utils';

const locations = [
    {
        city: 'San Francisco',
        country: 'USA',
        count: '2,400+',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80',
    },
    {
        city: 'New York',
        country: 'USA',
        count: '3,100+',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&q=80',
    },
    {
        city: 'London',
        country: 'UK',
        count: '1,800+',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80',
    },
    {
        city: 'Berlin',
        country: 'Germany',
        count: '950+',
        image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&q=80',
    },
    {
        city: 'Toronto',
        country: 'Canada',
        count: '820+',
        image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1200&q=90&auto=format&fit=crop',
    },
    {
        city: 'Sydney',
        country: 'Australia',
        count: '720+',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=90&auto=format&fit=crop',
    },
    {
        city: 'Dubai',
        country: 'UAE',
        count: '540+',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
    },
    {
        city: 'Remote',
        country: 'Worldwide',
        count: '5,200+',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
    },
];

const CAROUSEL_INTERVAL_MS = 2500;

function LocationLinks({
    activeIndex,
    onSelect,
}: {
    activeIndex: number;
    onSelect: (index: number) => void;
}) {
    return (
        <div className="grid gap-2.5 sm:grid-cols-2">
            {locations.map((loc, index) => {
                const isActive = index === activeIndex;
                return (
                    <Link
                        key={loc.city}
                        to={`${PUBLIC_PATHS.jobs}?location=${encodeURIComponent(loc.city)}`}
                        onMouseEnter={() => onSelect(index)}
                        onFocus={() => onSelect(index)}
                        className={cn(
                            'group flex min-w-0 items-center justify-between gap-2 rounded-xl border p-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            isActive
                                ? 'border-gold/35 bg-card shadow-elevation-2'
                                : 'border-border/60 bg-card hover:border-gold/20',
                        )}
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-all duration-400',
                                    isActive
                                        ? 'bg-gold/15 text-gold'
                                        : 'bg-muted text-muted-foreground group-hover:bg-gold/10 group-hover:text-gold',
                                )}
                            >
                                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                            </div>
                            <div className="min-w-0">
                                <p
                                    className={cn(
                                        'truncate font-medium transition-colors duration-300',
                                        isActive && 'text-navy dark:text-gold',
                                    )}
                                >
                                    {loc.city}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">{loc.country}</p>
                            </div>
                        </div>
                        <span
                            className={cn(
                                'shrink-0 text-sm font-semibold transition-all duration-400',
                                isActive ? 'text-gold' : 'text-highlight group-hover:text-gold',
                            )}
                        >
                            {loc.count}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}

export function LocationsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches,
    );
    const touchStartX = useRef(0);
    const active = locations[activeIndex];

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1023px)');
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const syncMobile = () => setIsMobile(mediaQuery.matches);
        syncMobile();
        mediaQuery.addEventListener('change', syncMobile);

        const advanceSlide = () => {
            if (!mediaQuery.matches || motionQuery.matches) return;
            setActiveIndex((prev) => (prev + 1) % locations.length);
        };

        const intervalId = window.setInterval(advanceSlide, CAROUSEL_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
            mediaQuery.removeEventListener('change', syncMobile);
        };
    }, []);

    const handleTouchStart = (event: TouchEvent) => {
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
        const diff = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) < 50) return;

        if (diff < 0) {
            setActiveIndex((prev) => (prev + 1) % locations.length);
            return;
        }

        setActiveIndex((prev) => (prev - 1 + locations.length) % locations.length);
    };

    return (
        <section className="landing-section-canvas section-spacing overflow-x-clip">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-6">
                    <div className="order-1 lg:col-start-2 lg:row-start-1">
                        <p className="section-eyebrow">Locations</p>
                        <h2 className="section-title">Where talent thrives</h2>
                        <p className="section-description">
                            Top hiring hubs and remote-first opportunities across the globe.
                        </p>
                    </div>

                    <div
                        className="order-2 lg:col-start-1 lg:row-span-2 lg:row-start-1"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="relative aspect-[4/3] min-h-[240px] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[460px]">
                            <div
                                className={cn(
                                    'flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                                    isMobile && 'h-full w-full',
                                )}
                                style={
                                    isMobile
                                        ? { transform: `translateX(-${activeIndex * 100}%)` }
                                        : undefined
                                }
                            >
                                {isMobile ? (
                                    locations.map((loc) => (
                                        <div key={loc.city} className="h-full w-full shrink-0">
                                            <img
                                                src={loc.image}
                                                alt={`${loc.city} cityscape`}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    locations.map((loc, i) => (
                                        <img
                                            key={loc.city}
                                            src={loc.image}
                                            alt={i === activeIndex ? `${loc.city} cityscape` : ''}
                                            aria-hidden={i !== activeIndex}
                                            className={cn(
                                                'image-crossfade',
                                                i === activeIndex ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                    ))
                                )}
                            </div>
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-navy/25" />
                            <div className="absolute bottom-5 left-5 right-5 transition-all duration-500 lg:bottom-7 lg:left-7 lg:right-auto">
                                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold">
                                    Global reach
                                </p>
                                <p
                                    key={active.city}
                                    className="mt-2 animate-fade-in font-display text-xl font-medium text-white motion-reduce:animate-none md:text-2xl"
                                >
                                    {active.city}
                                    <span className="font-normal text-white/60"> — {active.count} roles</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 lg:hidden" role="tablist" aria-label="Location images">
                            {locations.map((loc, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <button
                                        key={loc.city}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-label={`Show ${loc.city}`}
                                        onClick={() => setActiveIndex(index)}
                                        className={cn(
                                            'h-2.5 w-2.5 rounded-full border transition-all duration-300 motion-reduce:transition-none',
                                            isActive
                                                ? 'border-gold bg-gold scale-110'
                                                : 'border-muted-foreground/40 bg-transparent hover:border-muted-foreground/60',
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="order-3 hidden lg:col-start-2 lg:row-start-2 lg:block">
                        <LocationLinks activeIndex={activeIndex} onSelect={setActiveIndex} />
                    </div>
                </div>
            </div>
        </section>
    );
}
