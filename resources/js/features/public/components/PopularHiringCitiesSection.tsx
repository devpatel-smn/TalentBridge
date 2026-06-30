import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { PUBLIC_PATHS } from '@/lib/paths';
import type { Job } from '@/types/models';

const ROTATE_INTERVAL_MS = 3000;
const TOTAL_CITY_CARDS = 5;

const DEMO_CITIES = [
    { city: 'New York', count: 1254 },
    { city: 'London', count: 982 },
    { city: 'Berlin', count: 845 },
    { city: 'Toronto', count: 721 },
    { city: 'Singapore', count: 603 },
];

function aggregateTopCities(jobs: Job[]) {
    const counts = new Map<string, number>();

    for (const job of jobs) {
        const city = job.location_city?.trim();
        if (!city) continue;
        counts.set(city, (counts.get(city) ?? 0) + 1);
    }

    return Array.from(counts.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count);
}

function buildCityList(dynamicCities: { city: string; count: number }[]) {
    const result = [...dynamicCities];
    const used = new Set(result.map((entry) => entry.city.toLowerCase()));

    for (const demo of DEMO_CITIES) {
        if (result.length >= TOTAL_CITY_CARDS) break;
        if (!used.has(demo.city.toLowerCase())) {
            result.push(demo);
            used.add(demo.city.toLowerCase());
        }
    }

    return result.slice(0, TOTAL_CITY_CARDS);
}

async function fetchJobsForCities() {
    const firstPage = await jobsApi.list({ per_page: 100 });
    const jobs = [...(firstPage.data ?? [])];
    const lastPage = firstPage.meta?.pagination?.last_page ?? 1;

    if (lastPage > 1) {
        const remaining = await Promise.all(
            Array.from({ length: lastPage - 1 }, (_, index) =>
                jobsApi.list({ per_page: 100, page: index + 2 }),
            ),
        );
        remaining.forEach((page) => jobs.push(...(page.data ?? [])));
    }

    return jobs;
}

function useVisibleCount() {
    const [visibleCount, setVisibleCount] = useState(5);

    useEffect(() => {
        const update = () => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                setVisibleCount(5);
                return;
            }
            if (window.matchMedia('(min-width: 640px)').matches) {
                setVisibleCount(4);
                return;
            }
            setVisibleCount(2);
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return visibleCount;
}

export function PopularHiringCitiesSection() {
    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['jobs', 'popular-cities'],
        queryFn: fetchJobsForCities,
        staleTime: 5 * 60 * 1000,
    });

    const cities = useMemo(() => buildCityList(aggregateTopCities(jobs)), [jobs]);
    const visibleCount = useVisibleCount();
    const [offset, setOffset] = useState(0);
    const canRotate = cities.length > visibleCount;

    const visibleCities = useMemo(() => {
        return Array.from({ length: Math.min(visibleCount, cities.length) }, (_, index) => {
            return cities[(offset + index) % cities.length];
        });
    }, [cities, offset, visibleCount]);

    useEffect(() => {
        setOffset(0);
    }, [visibleCount, cities.length]);

    useEffect(() => {
        if (!canRotate) return;

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) return;

        const intervalId = window.setInterval(() => {
            setOffset((prev) => (prev + 1) % cities.length);
        }, ROTATE_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [canRotate, cities.length]);

    return (
        <div className="mt-6 min-w-0 md:mt-8">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                Popular Hiring Cities
            </p>

            {isLoading ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {Array.from({ length: TOTAL_CITY_CARDS }).map((_, index) => (
                        <Skeleton key={index} className="h-16 rounded-xl" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                        {visibleCities.map((city, index) => (
                            <Link
                                key={index}
                                to={`${PUBLIC_PATHS.jobs}?location=${encodeURIComponent(city.city)}`}
                                className="card-glow-hover group flex min-w-0 flex-col gap-1 rounded-xl border border-border/60 bg-card px-3 py-3.5 shadow-elevation-1 transition-all duration-700 dark:border-border/80 dark:bg-card sm:gap-1.5 sm:px-4 sm:py-4"
                            >
                                <span className="truncate text-base font-bold leading-snug text-highlight sm:text-lg">
                                    {city.count.toLocaleString()} Jobs
                                </span>
                                <span className="truncate text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-secondary">
                                    {city.city}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-3 flex justify-end sm:hidden">
                        <Link
                            to={PUBLIC_PATHS.jobs}
                            className="text-sm font-medium text-highlight transition-colors hover:text-highlight/80"
                        >
                            View All
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
