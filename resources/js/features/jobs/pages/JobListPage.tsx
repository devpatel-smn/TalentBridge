import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Briefcase, Building2, MapPin } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { PageMeta } from '@/components/common/PageMeta';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { useDebounce } from '@/hooks/useDebounce';
import { APP_NAME, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { formatDate, formatSalary, titleCase } from '@/lib/utils';
import type { EmploymentType, Job, WorkMode } from '@/types/models';

const WORK_MODES: WorkMode[] = ['remote', 'hybrid', 'onsite'];
const EMPLOYMENT_TYPES: EmploymentType[] = ['full_time', 'part_time', 'contract', 'internship', 'temporary', 'freelance'];

function PublicJobCard({ job }: { job: Job }) {
    const location = [job.location_city, job.location_state, job.location_country].filter(Boolean).join(', ');

    return (
        <Card className="card-glow-hover group flex h-full flex-col rounded-2xl border-border/60">
            <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                    <Link to={`/jobs/${job.uuid}`}>{job.title}</Link>
                </CardTitle>
                {job.company && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {job.company.name}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{titleCase(job.work_mode)}</Badge>
                    <Badge variant="outline">{titleCase(job.employment_type)}</Badge>
                </div>
                {location && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {location}
                    </div>
                )}
                <p className="text-sm font-medium text-primary">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.is_salary_visible)}
                </p>
                {job.published_at && (
                    <p className="text-xs text-muted-foreground">Posted {formatDate(job.published_at)}</p>
                )}
            </CardContent>
            <CardFooter className="border-t bg-muted/20 pt-4">
                <Link to={`/jobs/${job.uuid}`} className="text-sm font-medium text-primary hover:underline">
                    View details →
                </Link>
            </CardFooter>
        </Card>
    );
}

export function JobListPage() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
    const location = searchParams.get('location') ?? '';
    const [categoryId, setCategoryId] = useState(() => searchParams.get('category_id') ?? 'all');
    const [workMode, setWorkMode] = useState('all');
    const [employmentType, setEmploymentType] = useState('all');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 400);
    const debouncedLocation = useDebounce(location, 400);

    const { data: categories = [] } = useQuery({
        queryKey: ['job-categories', 'job-list'],
        queryFn: jobsApi.categories,
        staleTime: 10 * 60 * 1000,
    });

    const filters: Record<string, string> = {};
    if (categoryId !== 'all') filters.category_id = categoryId;
    if (workMode !== 'all') filters.work_mode = workMode;
    if (employmentType !== 'all') filters.employment_type = employmentType;
    if (debouncedLocation.trim()) filters.location_city = debouncedLocation.trim();

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['jobs', 'public', debouncedSearch, debouncedLocation, categoryId, workMode, employmentType, page],
        queryFn: () =>
            jobsApi.list({
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
                filter: filters,
            }),
        staleTime: 2 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const jobs = data?.data ?? [];
    const meta = data?.meta?.pagination;

    return (
        <>
            <PageMeta
                title="Jobs"
                description={`Browse open positions on ${APP_NAME}. No account required to explore.`}
            />
            <PageHero
                eyebrow="Opportunities"
                title="Find your next opportunity"
                description={`Browse open positions on ${APP_NAME}. No account required to explore.`}
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10 lg:px-8">
                    <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-4 shadow-elevation-1">
                        <SearchInput
                            value={search}
                            onChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            placeholder="Search jobs..."
                        />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Select
                                value={categoryId}
                                onValueChange={(v) => {
                                    setCategoryId(v);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={workMode}
                                onValueChange={(v) => {
                                    setWorkMode(v);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Work mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All work modes</SelectItem>
                                    {WORK_MODES.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {titleCase(mode)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={employmentType}
                                onValueChange={(v) => {
                                    setEmploymentType(v);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Employment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    {EMPLOYMENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {titleCase(type)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => (
                                <Skeleton key={i} className="h-56 rounded-2xl" />
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorState title="Unable to load jobs" onRetry={() => refetch()} />
                    ) : jobs.length === 0 ? (
                        <EmptyState
                            icon={Briefcase}
                            title="No jobs available"
                            description="Check back soon for new opportunities, or adjust your search filters."
                        />
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground">
                                {isFetching ? 'Updating...' : `${meta?.total ?? jobs.length} open position${(meta?.total ?? jobs.length) === 1 ? '' : 's'}`}
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {jobs.map((job) => (
                                    <PublicJobCard key={job.uuid} job={job} />
                                ))}
                            </div>
                            {meta && <Pagination meta={meta} onPageChange={setPage} />}
                        </>
                    )}
                </div>
        </>
    );
}
