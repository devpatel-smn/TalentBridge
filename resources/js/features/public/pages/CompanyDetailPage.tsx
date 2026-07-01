import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, MapPin } from 'lucide-react';
import { PageMeta } from '@/components/common/PageMeta';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { publicApi } from '@/features/public/api/public-api';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { PUBLIC_PATHS } from '@/lib/paths';
import { formatDate, formatSalary, titleCase } from '@/lib/utils';

export function CompanyDetailPage() {
    const { slug } = useParams<{ slug: string }>();

    const { data: company, isLoading, isError, refetch } = useQuery({
        queryKey: ['companies', slug],
        queryFn: () => publicApi.getCompany(slug!),
        enabled: !!slug,
    });

    const { data: jobsData } = useQuery({
        queryKey: ['jobs', 'company', slug],
        queryFn: () => jobsApi.list({ per_page: 20, filter: { company_slug: slug } }),
        enabled: !!slug,
    });

    const jobs = jobsData?.data ?? [];

    if (isLoading) return <LoadingSpinner label="Loading company..." />;

    if (isError || !company) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16">
                <ErrorState title="Company not found" onRetry={() => refetch()} />
            </div>
        );
    }

    return (
        <>
            <PageMeta title={company.name} description={company.description ?? `View open roles and company details for ${company.name} on TalentBridge.`} />
            <div className="page-hero">
                <div className="page-hero-inner">
                    <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 rounded-xl">
                        <Link to={PUBLIC_PATHS.companies}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            All companies
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/8 text-gold">
                            <Building2 className="h-9 w-9" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="page-hero-title">{company.name}</h1>
                                {company.verification_status === 'approved' && (
                                    <Badge className="bg-success/10 text-success">Verified</Badge>
                                )}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {company.industry && <span>{company.industry}</span>}
                                {company.company_size && <span>{company.company_size} employees</span>}
                                {company.headquarters && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {company.headquarters}
                                    </span>
                                )}
                            </div>
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                >
                                    <Globe className="h-3.5 w-3.5" />
                                    Visit website
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 md:px-6 lg:px-8">
                {company.description && (
                    <section>
                        <h2 className="text-xl font-semibold">About</h2>
                        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{company.description}</p>
                    </section>
                )}

                <section>
                    <h2 className="text-xl font-semibold">Open positions ({jobs.length})</h2>
                    {jobs.length === 0 ? (
                        <p className="mt-4 text-muted-foreground">No open positions at the moment.</p>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {jobs.map((job) => (
                                <Card key={job.uuid} className="card-interactive">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">
                                            <Link to={PUBLIC_PATHS.job(job.uuid)} className="hover:text-primary">
                                                {job.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            <Badge variant="secondary">{titleCase(job.work_mode)}</Badge>
                                            <Badge variant="outline">{titleCase(job.employment_type)}</Badge>
                                        </div>
                                        <p className="text-sm font-medium text-primary">
                                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.is_salary_visible)}
                                        </p>
                                        {job.published_at && (
                                            <p className="text-xs text-muted-foreground">Posted {formatDate(job.published_at)}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
