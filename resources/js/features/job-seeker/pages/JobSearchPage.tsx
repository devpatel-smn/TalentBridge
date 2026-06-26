import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { JOB_SEEKER_PATHS } from '@/lib/paths';
import { formatDate, formatSalary, titleCase } from '@/lib/utils';
import type { EmploymentType, Job, WorkMode } from '@/types/models';

const WORK_MODES: WorkMode[] = ['remote', 'hybrid', 'onsite'];
const EMPLOYMENT_TYPES: EmploymentType[] = ['full_time', 'part_time', 'contract', 'internship', 'temporary', 'freelance'];

function JobCard({ job }: { job: Job }) {
    const location = [job.location_city, job.location_state, job.location_country].filter(Boolean).join(', ');

    return (
        <Card className="group flex h-full flex-col transition-all hover:border-primary/30 hover:shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                        <Link to={JOB_SEEKER_PATHS.job(job.uuid)}>{job.title}</Link>
                    </CardTitle>
                </div>
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
            <CardFooter className="border-t bg-muted/30 pt-4">
                <Link
                    to={JOB_SEEKER_PATHS.job(job.uuid)}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    View details →
                </Link>
            </CardFooter>
        </Card>
    );
}

export function JobSearchPage() {
    const [search, setSearch] = useState('');
    const [workMode, setWorkMode] = useState<string>('all');
    const [employmentType, setEmploymentType] = useState<string>('all');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 400);

    const filters: Record<string, string> = {};
    if (workMode !== 'all') filters.work_mode = workMode;
    if (employmentType !== 'all') filters.employment_type = employmentType;

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['jobs', 'search', debouncedSearch, workMode, employmentType, page],
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
        <div className="space-y-6">
            <PageHeader
                title="Job search"
                description="Discover opportunities that match your skills and preferences."
            />

            <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
                <SearchInput
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        setPage(1);
                    }}
                    placeholder="Search by title, company, or keyword..."
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
                <LoadingSpinner label="Searching jobs..." />
            ) : isError ? (
                <ErrorState title="Search failed" description="We couldn't load jobs right now." onRetry={() => refetch()} />
            ) : jobs.length === 0 ? (
                <EmptyState
                    icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
                    title="No jobs found"
                    description="Try adjusting your filters or search terms to find more opportunities."
                    action={{ label: 'Clear filters', onClick: () => { setSearch(''); setWorkMode('all'); setEmploymentType('all'); setPage(1); } }}
                />
            ) : (
                <>
                    <p className="text-sm text-muted-foreground">
                        {isFetching ? 'Updating...' : `${meta?.total ?? jobs.length} job${(meta?.total ?? jobs.length) === 1 ? '' : 's'} found`}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job.uuid} job={job} />
                        ))}
                    </div>
                    {meta && <Pagination meta={meta} onPageChange={setPage} />}
                </>
            )}
        </div>
    );
}
