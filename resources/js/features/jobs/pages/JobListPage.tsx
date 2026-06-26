import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, MapPin } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        <Card className="group flex h-full flex-col transition-all hover:border-primary/30 hover:shadow-lg">
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
    const [search, setSearch] = useState('');
    const [workMode, setWorkMode] = useState('all');
    const [employmentType, setEmploymentType] = useState('all');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 400);

    const filters: Record<string, string> = {};
    if (workMode !== 'all') filters.work_mode = workMode;
    if (employmentType !== 'all') filters.employment_type = employmentType;

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['jobs', 'public', debouncedSearch, workMode, employmentType, page],
        queryFn: () =>
            jobsApi.list({
                page,
                per_page: DEFAULT_PAGE_SIZE,
                search: debouncedSearch || undefined,
                filter: filters,
            }),
    });

    const jobs = data?.data ?? [];
    const meta = data?.meta?.pagination;

    return (
        <>
            <div className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background">
                <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Find your next opportunity
                    </h1>
                    <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
                        Browse open positions on {APP_NAME}. No account required to explore.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
                        <SearchInput
                            value={search}
                            onChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            placeholder="Search jobs..."
                            className="flex-1"
                        />
                        <Select
                            value={workMode}
                            onValueChange={(v) => {
                                setWorkMode(v);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full lg:w-44">
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
                            <SelectTrigger className="w-full lg:w-48">
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

                    {isLoading ? (
                        <LoadingSpinner label="Loading jobs..." />
                    ) : isError ? (
                        <ErrorState title="Unable to load jobs" onRetry={() => refetch()} />
                    ) : jobs.length === 0 ? (
                        <EmptyState
                            icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
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
