import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { PageSection } from '@/components/common/PageSection';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/features/admin/api/admin-api';
import { DetailField } from '@/features/admin/components/DetailField';
import { formatDate, formatDateTime, formatSalary, titleCase } from '@/lib/utils';

interface JobSeekerDetail {
    uuid: string;
    headline?: string | null;
    summary?: string | null;
    current_title?: string | null;
    years_of_experience?: string | null;
    expected_salary_min?: string | null;
    expected_salary_max?: string | null;
    salary_currency?: string;
    location_city?: string | null;
    location_state?: string | null;
    location_country?: string | null;
    linkedin_url?: string | null;
    portfolio_url?: string | null;
    profile_completion?: number;
    is_open_to_work?: boolean;
    is_profile_public?: boolean;
    willing_to_relocate?: boolean;
    preferred_work_mode?: string | null;
    preferred_employment_type?: string | null;
    user?: {
        id: number;
        full_name: string;
        email: string;
        phone?: string | null;
        status: string;
        email_verified_at?: string | null;
        last_login_at?: string | null;
        created_at?: string | null;
    };
    skills?: Array<{ id: number; name: string; proficiency_level?: string | null }>;
    experiences?: Array<{
        company_name: string;
        job_title: string;
        employment_type?: string | null;
        location?: string | null;
        description?: string | null;
        started_at?: string | null;
        ended_at?: string | null;
        is_current?: boolean;
    }>;
    educations?: Array<{
        institution: string;
        degree: string;
        field_of_study?: string | null;
        grade?: string | null;
        started_at?: string | null;
        ended_at?: string | null;
        is_current?: boolean;
    }>;
    resumes?: Array<{
        uuid: string;
        title: string;
        is_primary?: boolean;
        source?: string;
        created_at?: string | null;
    }>;
    created_at?: string | null;
}

function formatLocation(profile: JobSeekerDetail): string {
    return [profile.location_city, profile.location_state, profile.location_country].filter(Boolean).join(', ') || '—';
}

export function AdminUserDetailPage() {
    const { uuid } = useParams<{ uuid: string }>();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'job-seeker', uuid],
        queryFn: async () => (await adminApi.jobSeeker(uuid!)) as unknown as JobSeekerDetail,
        enabled: Boolean(uuid),
    });

    if (isLoading) {
        return <LoadingSpinner className="py-16" label="Loading job seeker details..." />;
    }

    if (isError || !data) {
        return (
            <ErrorState
                title="Failed to load job seeker"
                description={error instanceof Error ? error.message : 'Job seeker not found.'}
                onRetry={() => refetch()}
            />
        );
    }

    const user = data.user;

    return (
        <div className="space-y-6">
            <PageHeader
                title={user?.full_name ?? 'Job seeker'}
                description={data.headline ?? data.current_title ?? 'Job seeker profile details'}
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Users', href: '/admin/users' },
                    { label: user?.full_name ?? 'Details' },
                ]}
                actions={
                    <Button variant="outline" asChild>
                        <Link to="/admin/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to users
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <DetailField label="Full name" value={user?.full_name} />
                            <DetailField label="Email" value={user?.email} />
                            <DetailField label="Phone" value={user?.phone} />
                            <DetailField label="Status">
                                {user?.status ? <StatusBadge status={user.status} /> : '—'}
                            </DetailField>
                            <DetailField label="Email verified" value={user?.email_verified_at ? 'Yes' : 'No'} />
                            <DetailField label="Last login" value={formatDateTime(user?.last_login_at)} />
                            <DetailField label="Joined" value={formatDate(user?.created_at)} />
                            <DetailField label="Profile completion" value={`${data.profile_completion ?? 0}%`} />
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <DetailField label="Open to work" value={data.is_open_to_work ? 'Yes' : 'No'} />
                            <DetailField label="Public profile" value={data.is_profile_public ? 'Yes' : 'No'} />
                            <DetailField label="Willing to relocate" value={data.willing_to_relocate ? 'Yes' : 'No'} />
                            <DetailField
                                label="Preferred work mode"
                                value={data.preferred_work_mode ? titleCase(data.preferred_work_mode) : '—'}
                            />
                            <DetailField
                                label="Preferred employment"
                                value={data.preferred_employment_type ? titleCase(data.preferred_employment_type) : '—'}
                            />
                            <DetailField
                                label="Expected salary"
                                value={formatSalary(
                                    data.expected_salary_min ? Number(data.expected_salary_min) : null,
                                    data.expected_salary_max ? Number(data.expected_salary_max) : null,
                                    data.salary_currency ?? 'USD',
                                )}
                            />
                            <DetailField label="Location" value={formatLocation(data)} className="sm:col-span-2" />
                            <DetailField label="LinkedIn" value={data.linkedin_url} />
                            <DetailField label="Portfolio" value={data.portfolio_url} />
                        </dl>
                    </CardContent>
                </Card>
            </div>

            {data.summary && (
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{data.summary}</p>
                    </CardContent>
                </Card>
            )}

            {data.skills && data.skills.length > 0 && (
                <PageSection title="Skills">
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <Badge key={skill.id} variant="secondary">
                                {skill.name}
                                {skill.proficiency_level ? ` · ${titleCase(skill.proficiency_level)}` : ''}
                            </Badge>
                        ))}
                    </div>
                </PageSection>
            )}

            {data.experiences && data.experiences.length > 0 && (
                <PageSection title="Experience">
                    <div className="space-y-4">
                        {data.experiences.map((exp, index) => (
                            <Card key={`${exp.company_name}-${exp.job_title}-${index}`}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="font-medium">{exp.job_title}</p>
                                            <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(exp.started_at)} – {exp.is_current ? 'Present' : formatDate(exp.ended_at)}
                                        </p>
                                    </div>
                                    {exp.location && <p className="mt-2 text-sm text-muted-foreground">{exp.location}</p>}
                                    {exp.description && (
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </PageSection>
            )}

            {data.educations && data.educations.length > 0 && (
                <PageSection title="Education">
                    <div className="space-y-4">
                        {data.educations.map((edu, index) => (
                            <Card key={`${edu.institution}-${edu.degree}-${index}`}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="font-medium">{edu.degree}</p>
                                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                            {edu.field_of_study && (
                                                <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(edu.started_at)} – {edu.is_current ? 'Present' : formatDate(edu.ended_at)}
                                        </p>
                                    </div>
                                    {edu.grade && <p className="mt-2 text-sm text-muted-foreground">Grade: {edu.grade}</p>}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </PageSection>
            )}

            {data.resumes && data.resumes.length > 0 && (
                <PageSection title="Resumes">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {data.resumes.map((resume) => (
                            <Card key={resume.uuid}>
                                <CardContent className="pt-6">
                                    <p className="font-medium">{resume.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {titleCase(resume.source ?? 'upload')}
                                        {resume.is_primary ? ' · Primary' : ''}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(resume.created_at)}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </PageSection>
            )}
        </div>
    );
}
