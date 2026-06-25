import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { PageSection } from '@/components/common/PageSection';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/features/admin/api/admin-api';
import { DetailField } from '@/features/admin/components/DetailField';
import { formatDate, formatDateTime, titleCase } from '@/lib/utils';

interface CompanyDetail {
    uuid: string;
    name: string;
    slug?: string;
    description?: string | null;
    website?: string | null;
    industry?: string | null;
    company_size?: string | null;
    founded_year?: number | null;
    headquarters?: string | null;
    verification_status: string;
    verified_at?: string | null;
    social_links?: Record<string, string> | null;
    jobs_count?: number;
    creator?: { id: number; full_name: string; email: string } | null;
    verifier?: { id: number; full_name: string; email: string } | null;
    team?: Array<{
        id: number;
        job_title?: string | null;
        is_primary?: boolean;
        is_active?: boolean;
        joined_at?: string | null;
        user?: { id: number; full_name: string; email: string; status: string } | null;
    }>;
    created_at?: string | null;
    updated_at?: string | null;
}

export function AdminCompanyDetailPage() {
    const { uuid } = useParams<{ uuid: string }>();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'company', uuid],
        queryFn: async () => (await adminApi.company(uuid!)) as unknown as CompanyDetail,
        enabled: Boolean(uuid),
    });

    if (isLoading) {
        return <LoadingSpinner className="py-16" label="Loading company details..." />;
    }

    if (isError || !data) {
        return (
            <ErrorState
                title="Failed to load company"
                description={error instanceof Error ? error.message : 'Company not found.'}
                onRetry={() => refetch()}
            />
        );
    }

    const socialLinks = data.social_links ? Object.entries(data.social_links).filter(([, url]) => url) : [];

    return (
        <div className="space-y-6">
            <PageHeader
                title={data.name}
                description={data.industry ? `${data.industry} · ${data.headquarters ?? 'No headquarters listed'}` : data.headquarters ?? 'Company profile details'}
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Companies', href: '/admin/companies' },
                    { label: data.name },
                ]}
                actions={
                    <Button variant="outline" asChild>
                        <Link to="/admin/companies">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to companies
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Company information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <DetailField label="Name" value={data.name} />
                            <DetailField label="Industry" value={data.industry} />
                            <DetailField label="Company size" value={data.company_size} />
                            <DetailField label="Founded" value={data.founded_year?.toString()} />
                            <DetailField label="Headquarters" value={data.headquarters} />
                            <DetailField label="Website" value={data.website} />
                            <DetailField label="Active jobs" value={data.jobs_count?.toLocaleString() ?? '0'} />
                            <DetailField label="Joined" value={formatDate(data.created_at)} />
                            <DetailField label="Verification">
                                <StatusBadge status={data.verification_status} />
                            </DetailField>
                            <DetailField label="Verified at" value={formatDateTime(data.verified_at)} />
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ownership & verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-4">
                            <DetailField label="Created by" value={data.creator?.full_name} />
                            <DetailField label="Creator email" value={data.creator?.email} />
                            <DetailField label="Verified by" value={data.verifier?.full_name ?? '—'} />
                            <DetailField label="Verifier email" value={data.verifier?.email ?? '—'} />
                            <DetailField label="Last updated" value={formatDateTime(data.updated_at)} />
                        </dl>
                    </CardContent>
                </Card>
            </div>

            {data.description && (
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{data.description}</p>
                    </CardContent>
                </Card>
            )}

            {socialLinks.length > 0 && (
                <PageSection title="Social links">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        {socialLinks.map(([platform, url]) => (
                            <DetailField key={platform} label={titleCase(platform)} value={url} />
                        ))}
                    </dl>
                </PageSection>
            )}

            {data.team && data.team.length > 0 && (
                <PageSection title="Team members" description="Employer accounts linked to this company.">
                    <div className="overflow-hidden rounded-xl border border-border/80">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/40">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.team.map((member) => (
                                    <tr key={member.id} className="border-b border-border/40 last:border-0">
                                        <td className="px-4 py-3 font-medium">{member.user?.full_name ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{member.user?.email ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{member.job_title ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            {member.user?.status ? (
                                                <StatusBadge status={member.user.status} />
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{formatDate(member.joined_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PageSection>
            )}
        </div>
    );
}
