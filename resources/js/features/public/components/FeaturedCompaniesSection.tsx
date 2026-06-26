import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Briefcase, Building2, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { PUBLIC_PATHS } from '@/lib/paths';
import { StaggerReveal } from '@/components/common/RevealSection';
import type { Company, Job } from '@/types/models';

const MIN_CAROUSEL_COUNT = 6;

interface CompanyWithMeta extends Company {
    openPositions: number;
}

function aggregateCompanies(jobs: Job[]): CompanyWithMeta[] {
    const map = new Map<string, CompanyWithMeta>();

    for (const job of jobs) {
        if (!job.company?.slug) continue;
        const existing = map.get(job.company.slug);
        if (existing) {
            existing.openPositions += 1;
        } else {
            map.set(job.company.slug, { ...job.company, openPositions: 1 });
        }
    }

    return Array.from(map.values()).sort((a, b) => b.openPositions - a.openPositions).slice(0, 12);
}

function CompanyCard({ company }: { company: CompanyWithMeta }) {
    const location = company.headquarters ?? 'Global';

    return (
        <Link
            to={PUBLIC_PATHS.company(company.slug)}
            className="group flex h-full min-w-0 flex-col rounded-xl border border-white/12 bg-white/[0.07] p-5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.4)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold/35 hover:bg-white/10 hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5),0_0_0_1px_hsl(var(--gold)/0.14)] sm:p-6"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold transition-all duration-400 group-hover:border-gold/45 group-hover:bg-gold group-hover:text-navy group-hover:shadow-[0_4px_16px_-4px_hsl(var(--gold)/0.4)]">
                    <Building2 className="h-5 w-5 transition-transform duration-400 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-white/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
            </div>

            <h3 className="mt-5 truncate font-display text-lg font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-gold">
                {company.name}
            </h3>

            {company.industry && (
                <p className="mt-1.5 truncate text-sm leading-relaxed text-white/50">{company.industry}</p>
            )}

            <div className="mt-auto space-y-2.5 border-t border-white/8 pt-5">
                <p className="flex items-center gap-1.5 text-xs text-white/45">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{location}</span>
                </p>
                <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    {company.openPositions} open {company.openPositions === 1 ? 'position' : 'positions'}
                </p>
            </div>
        </Link>
    );
}

export function FeaturedCompaniesSection() {
    const { data, isLoading } = useQuery({
        queryKey: ['jobs', 'companies-featured'],
        queryFn: () => jobsApi.list({ per_page: 50 }),
    });

    const companies = aggregateCompanies(data?.data ?? []);
    const useCarousel = companies.length >= MIN_CAROUSEL_COUNT;
    const carouselItems = useCarousel ? [...companies, ...companies] : companies;

    return (
        <section className="surface-navy grain-overlay overflow-x-clip py-14 md:py-16">
            <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Employers</p>
                        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-white md:text-4xl">
                            Companies hiring now
                        </h2>
                    </div>
                    <Link
                        to={PUBLIC_PATHS.companies}
                        className="shrink-0 text-sm font-medium text-white/55 transition-colors duration-300 hover:text-gold"
                    >
                        View all companies →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-44 rounded-xl bg-white/5" />
                        ))}
                    </div>
                ) : companies.length > 0 ? (
                    useCarousel ? (
                        <div className="marquee-container mt-8">
                            <div className="marquee-track gap-4 motion-reduce:flex motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:[animation:none]">
                                {carouselItems.map((company, i) => (
                                    <div key={`${company.slug}-${i}`} className="w-[17rem] max-w-full shrink-0 sm:w-72">
                                        <CompanyCard company={company} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <StaggerReveal
                            variant="scale"
                            staggerMs={80}
                            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {companies.map((company) => (
                                <CompanyCard key={company.slug} company={company} />
                            ))}
                        </StaggerReveal>
                    )
                ) : null}
            </div>
        </section>
    );
}
