import { Briefcase, Building2, Globe, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { RevealSection } from '@/components/common/RevealSection';
import { usePlatformStats } from '@/features/public/hooks/useHomepageJobs';
import { cn } from '@/lib/utils';

interface StatItem {
    label: string;
    value: string;
    icon: LucideIcon;
    accent: string;
}

function buildStats(
    openPositions: number | undefined,
    companyCount: number,
    countries: number,
    jobSeekers: number | undefined,
    hasApiData: boolean,
    isError: boolean,
): StatItem[] {
    const open =
        openPositions != null && openPositions > 0
            ? openPositions.toLocaleString()
            : !hasApiData || isError
              ? '10K+'
              : '0';

    const companies =
        companyCount > 0
            ? `${companyCount.toLocaleString()}+`
            : !hasApiData || isError
              ? '2,500+'
              : '0';

    const seekers =
        jobSeekers != null && jobSeekers > 0
            ? `${Math.round(jobSeekers / 1000)}K+`
            : !hasApiData || isError
              ? '50K+'
              : '0';

    const countryCount =
        countries > 0
            ? `${countries}+`
            : !hasApiData || isError
              ? '45+'
              : '0';

    return [
        { label: 'Open positions', value: open, icon: Briefcase, accent: 'text-gold' },
        { label: 'Verified companies', value: companies, icon: Building2, accent: 'text-gold' },
        { label: 'Active job seekers', value: seekers, icon: Users, accent: 'text-success' },
        { label: 'Countries served', value: countryCount, icon: Globe, accent: 'text-info' },
    ];
}

export function PlatformStatsSection() {
    const { openPositions, companyCount, countries, jobSeekers, isError, data } = usePlatformStats();
    const hasApiData = Boolean(data?.data?.length);
    const stats = buildStats(openPositions, companyCount, countries, jobSeekers, hasApiData, isError);

    return (
        <section
            data-section-tone="dark"
            className="surface-navy grain-overlay relative flex min-h-[13.5rem] flex-col justify-center overflow-x-clip md:min-h-[15rem]"
        >
            <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12 lg:px-8">
                <RevealSection variant="fade-up">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-0">
                        {stats.map((stat, i) => (
                            <div
                                key={stat.label}
                                className={cn(
                                    'flex flex-col items-center px-2 py-2 text-center sm:px-4',
                                    i >= 2 && 'max-lg:border-t max-lg:border-white/10 max-lg:pt-8',
                                    i % 2 === 1 && 'max-lg:border-l max-lg:border-white/10',
                                    i > 0 && 'lg:border-l lg:border-white/10 lg:py-0',
                                )}
                            >
                                <div className="icon-container-sm mb-3 border-white/15 bg-white/8 text-gold sm:mb-4">
                                    <stat.icon className="h-5 w-5" strokeWidth={1.5} />
                                </div>
                                <p
                                    className={cn(
                                        'font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]',
                                        stat.accent,
                                    )}
                                >
                                    <AnimatedCounter value={stat.value} />
                                </p>
                                <p className="mt-2 max-w-[10rem] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-on-dark-subtle sm:mt-3 sm:text-xs">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </RevealSection>
            </div>
        </section>
    );
}
