import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { PageMeta } from '@/components/common/PageMeta';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { publicApi } from '@/features/public/api/public-api';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { PUBLIC_PATHS } from '@/lib/paths';
import { titleCase } from '@/lib/utils';
import type { VerificationStatus } from '@/types/models';

const VERIFICATION_STATUSES: VerificationStatus[] = ['approved', 'pending', 'under_review'];

export function CompaniesPage() {
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [industry, setIndustry] = useState('all');
    const [verificationStatus, setVerificationStatus] = useState('all');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 400);
    const debouncedLocation = useDebounce(location, 400);

    const { data: industries = [] } = useQuery({
        queryKey: ['companies', 'industries'],
        queryFn: publicApi.getCompanyIndustries,
        staleTime: 10 * 60 * 1000,
    });

    const filters: Record<string, string> = {};
    if (industry !== 'all') filters.industry = industry;
    if (verificationStatus !== 'all') filters.verification_status = verificationStatus;
    if (debouncedLocation.trim()) filters.headquarters = debouncedLocation.trim();

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['companies', 'public', debouncedSearch, debouncedLocation, industry, verificationStatus, page],
        queryFn: () =>
            publicApi.listCompanies({
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
                filter: filters,
                sort: 'name',
                order: 'asc',
            }),
    });

    const companies = data?.data ?? [];
    const meta = data?.meta?.pagination;

    return (
        <>
            <PageMeta
                title="Companies"
                description="Explore verified employers with open positions on TalentBridge."
            />
            <PageHero
                eyebrow="Employers"
                title="Companies hiring now"
                description="Explore verified employers with open positions on TalentBridge"
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10 lg:px-8">
                <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-4 shadow-elevation-1">
                    <SearchInput
                        value={search}
                        onChange={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                        placeholder="Search companies..."
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="relative">
                            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={location}
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Location"
                                autoComplete="off"
                                className="h-10 w-full rounded-xl border-border/80 bg-background pl-10 shadow-xs"
                                aria-label="Filter by location"
                            />
                        </div>
                        <Select
                            value={industry}
                            onValueChange={(v) => {
                                setIndustry(v);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Industry" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All industries</SelectItem>
                                {industries.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={verificationStatus}
                            onValueChange={(v) => {
                                setVerificationStatus(v);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All companies</SelectItem>
                                {VERIFICATION_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {titleCase(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingSpinner label="Loading companies..." />
                ) : isError ? (
                    <ErrorState title="Unable to load companies" onRetry={() => refetch()} />
                ) : companies.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="No companies found"
                        description="Try adjusting your search or check back later."
                    />
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {isFetching ? 'Updating...' : `${meta?.total ?? companies.length} compan${(meta?.total ?? companies.length) === 1 ? 'y' : 'ies'}`}
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {companies.map((company) => (
                                <Link key={company.slug} to={PUBLIC_PATHS.company(company.slug)}>
                                    <Card className="card-glow-hover group h-full rounded-2xl border-border/60">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                    <Building2 className="h-6 w-6" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h2 className="truncate font-semibold group-hover:text-primary">{company.name}</h2>
                                                        {company.verification_status === 'approved' && (
                                                            <Badge className="bg-success/10 text-success">Verified</Badge>
                                                        )}
                                                    </div>
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
                                                        {company.open_jobs_count ?? 0} open role
                                                        {(company.open_jobs_count ?? 0) === 1 ? '' : 's'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        {meta && <Pagination meta={meta} onPageChange={setPage} />}
                    </>
                )}
            </div>
        </>
    );
}
