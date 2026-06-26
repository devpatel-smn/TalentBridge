import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { useDebounce } from '@/hooks/useDebounce';
import { PUBLIC_PATHS } from '@/lib/paths';
import type { Company, Job } from '@/types/models';

function extractCompanies(jobs: Job[], search: string): Company[] {
    const map = new Map<string, Company & { jobCount: number }>();
    for (const job of jobs) {
        if (!job.company?.slug) continue;
        const existing = map.get(job.company.slug);
        if (existing) {
            existing.jobCount += 1;
        } else {
            map.set(job.company.slug, { ...job.company, jobCount: 1 });
        }
    }
    let list = Array.from(map.values());
    if (search) {
        const q = search.toLowerCase();
        list = list.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                (c.industry?.toLowerCase().includes(q) ?? false) ||
                (c.headquarters?.toLowerCase().includes(q) ?? false),
        );
    }
    return list.sort((a, b) => b.jobCount - a.jobCount);
}

export function CompaniesPage() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['jobs', 'companies-directory'],
        queryFn: () => jobsApi.list({ per_page: 100 }),
    });

    const companies = extractCompanies(data?.data ?? [], debouncedSearch);

    return (
        <>
            <div className="border-b border-border/60 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Companies hiring now</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Explore verified employers with open positions on TalentBridge
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 lg:px-8">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search companies..."
                    className="max-w-md"
                />

                {isLoading ? (
                    <LoadingSpinner label="Loading companies..." />
                ) : isError ? (
                    <ErrorState title="Unable to load companies" onRetry={() => refetch()} />
                ) : companies.length === 0 ? (
                    <EmptyState
                        icon={<Building2 className="h-6 w-6 text-muted-foreground" />}
                        title="No companies found"
                        description="Try adjusting your search or check back later."
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {companies.map((company) => (
                            <Link key={company.slug} to={PUBLIC_PATHS.company(company.slug)}>
                                <Card className="group h-full transition-all hover:border-primary/30 hover:shadow-elevation-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h2 className="truncate font-semibold group-hover:text-primary">{company.name}</h2>
                                                {company.industry && (
                                                    <p className="mt-0.5 text-sm text-muted-foreground">{company.industry}</p>
                                                )}
                                                {company.headquarters && (
                                                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {company.headquarters}
                                                    </p>
                                                )}
                                                <Badge variant="secondary" className="mt-3">
                                                    {(company as Company & { jobCount: number }).jobCount} open role
                                                    {(company as Company & { jobCount: number }).jobCount === 1 ? '' : 's'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
