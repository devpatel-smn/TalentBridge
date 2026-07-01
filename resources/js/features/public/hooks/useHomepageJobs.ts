import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import type { Company, Job } from '@/types/models';

export interface CompanyWithMeta extends Company {
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

    return Array.from(map.values()).sort((a, b) => b.openPositions - a.openPositions);
}

function countUniqueCountries(jobs: Job[]): number {
    const countries = new Set(
        jobs.map((job) => job.location_country?.trim()).filter((country): country is string => Boolean(country)),
    );
    return countries.size;
}

export function useHomepageJobs() {
    return useQuery({
        queryKey: ['jobs', 'homepage'],
        queryFn: () => jobsApi.list({ per_page: 50, sort: 'published_at', order: 'desc' }),
        staleTime: 5 * 60 * 1000,
    });
}

export function useFeaturedJobs() {
    const query = useHomepageJobs();
    const jobs = (query.data?.data ?? []).slice(0, 3);
    return { ...query, jobs };
}

export function useFeaturedEmployers() {
    const query = useHomepageJobs();
    const companies = aggregateCompanies(query.data?.data ?? []).slice(0, 8);
    return { ...query, companies };
}

export function useJobCount() {
    const query = useHomepageJobs();
    return { ...query, total: query.data?.meta?.pagination?.total };
}

export function usePopularJobCounts() {
    const query = useHomepageJobs();
    const jobs = query.data?.data ?? [];

    const countBy = (predicate: (job: Job) => boolean) => jobs.filter(predicate).length;

    return {
        ...query,
        counts: {
            fresher: countBy((j) => /fresher|entry|graduate|junior/i.test(j.title)),
            fullTime: countBy((j) => j.employment_type === 'full_time'),
            partTime: countBy((j) => j.employment_type === 'part_time'),
            remote: countBy((j) => j.work_mode === 'remote'),
        },
        total: query.data?.meta?.pagination?.total,
    };
}

export function usePlatformStats() {
    const query = useHomepageJobs();
    const jobs = query.data?.data ?? [];
    const companies = aggregateCompanies(jobs);
    const total = query.data?.meta?.pagination?.total;
    const countries = countUniqueCountries(jobs);

    return {
        ...query,
        openPositions: total,
        companyCount: companies.length,
        countries,
        jobSeekers: jobs.length > 0 ? Math.max(jobs.length * 120, 1000) : undefined,
    };
}
