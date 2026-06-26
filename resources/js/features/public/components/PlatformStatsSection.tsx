import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';

const baseStats = [
    { label: 'Active job seekers', value: '50K+', accent: 'text-secondary' },
    { label: 'Verified companies', value: '2,500+', accent: 'text-accent-purple' },
    { label: 'Successful placements', value: '18K+', accent: 'text-gold' },
    { label: 'Countries served', value: '45+', accent: 'text-info' },
];

export function PlatformStatsSection() {
    const { data } = useQuery({
        queryKey: ['jobs', 'stats-count'],
        queryFn: () => jobsApi.list({ per_page: 1 }),
    });

    const jobCount = data?.meta?.pagination?.total;
    const stats = [
        ...(jobCount != null
            ? [{ label: 'Open positions', value: jobCount.toLocaleString(), accent: 'text-highlight' }]
            : []),
        ...baseStats,
    ].slice(0, 4);

    return (
        <section className="surface-navy grain-overlay relative">
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-11 lg:px-8">
                <div className="grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`px-4 py-2 text-center ${i > 0 ? 'max-lg:border-t max-lg:border-white/10 max-lg:pt-8' : ''} ${i % 2 === 1 ? 'max-lg:border-l max-lg:border-white/10' : ''}`}
                        >
                            <p className={`font-display text-4xl font-medium tracking-tight md:text-5xl ${stat.accent}`}>
                                <AnimatedCounter value={stat.value} />
                            </p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-white/45">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
