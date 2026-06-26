import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { PUBLIC_PATHS } from '@/lib/paths';
import { cn } from '@/lib/utils';

const locations = [
    {
        city: 'San Francisco',
        country: 'USA',
        count: '2,400+',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
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
        image: 'https://images.unsplash.com/photo-1560963184-910fe7148615?w=900&q=80',
    },
    {
        city: 'Remote',
        country: 'Worldwide',
        count: '5,200+',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
    },
    {
        city: 'Singapore',
        country: 'Singapore',
        count: '720+',
        image: 'https://images.unsplash.com/photo-1525626430024-3ffaaaf8d2db?w=900&q=80',
    },
];

export function LocationsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = locations[activeIndex];

    return (
        <section className="landing-section-canvas overflow-x-clip py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-14">
                    <div className="relative aspect-[4/3] min-h-[240px] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[460px]">
                        {locations.map((loc, i) => (
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
                        ))}
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

                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Locations</p>
                        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">
                            Where talent thrives
                        </h2>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            Top hiring hubs and remote-first opportunities across the globe.
                        </p>

                        <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                            {locations.map((loc, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <Link
                                        key={loc.city}
                                        to={`${PUBLIC_PATHS.jobs}?location=${encodeURIComponent(loc.city)}`}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onFocus={() => setActiveIndex(index)}
                                        className={cn(
                                            'group flex min-w-0 items-center justify-between gap-2 rounded-xl border p-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                            isActive
                                                ? 'border-gold/35 bg-card shadow-elevation-2 dark:border-gold/30 dark:bg-card'
                                                : 'border-border/60 bg-card hover:border-gold/20 hover:bg-card dark:border-border/80 dark:hover:border-gold/20',
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
                    </div>
                </div>
            </div>
        </section>
    );
}
