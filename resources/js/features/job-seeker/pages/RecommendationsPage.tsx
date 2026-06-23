import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { formatSalary, titleCase } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { Job } from '@/types/models';

interface Recommendation {
    uuid: string;
    score?: number;
    job?: Job;
}

async function fetchRecommendations(): Promise<Recommendation[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Recommendation[]>>('/job-seeker/recommendations');
        return data.data ?? [];
    } catch {
        return [];
    }
}

export function RecommendationsPage() {
    const { data: recommendations = [], isLoading } = useQuery({
        queryKey: ['job-seeker', 'recommendations'],
        queryFn: fetchRecommendations,
        retry: false,
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Job recommendations"
                description="Personalized job matches based on your profile and activity."
            />

            {isLoading ? (
                <LoadingSpinner label="Finding recommendations..." />
            ) : recommendations.length === 0 ? (
                <EmptyState
                    icon={<Sparkles className="h-6 w-6 text-muted-foreground" />}
                    title="No recommendations yet"
                    description="Complete your profile and start applying to jobs. We'll surface matched opportunities here as they become available."
                    action={{ label: 'Complete profile', onClick: () => { window.location.href = '/job-seeker/profile'; } }}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {recommendations.map((rec) => {
                        const job = rec.job;
                        if (!job) return null;
                        const location = [job.location_city, job.location_state].filter(Boolean).join(', ');
                        return (
                            <Card key={rec.uuid} className="flex h-full flex-col transition-all hover:shadow-lg">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-lg">
                                            <Link to={`/job-seeker/jobs/${job.uuid}`} className="hover:text-primary">
                                                {job.title}
                                            </Link>
                                        </CardTitle>
                                        {rec.score != null && (
                                            <Badge variant="success">{Math.round(rec.score)}% match</Badge>
                                        )}
                                    </div>
                                    {job.company && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Building2 className="h-3.5 w-3.5" />
                                            {job.company.name}
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-1 space-y-2">
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
                                </CardContent>
                                <CardFooter className="border-t pt-4">
                                    <Button asChild variant="outline" size="sm" className="w-full">
                                        <Link to={`/job-seeker/jobs/${job.uuid}`}>View job</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
