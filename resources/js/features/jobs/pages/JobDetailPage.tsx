import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Bookmark,
    Building2,
    Calendar,
    CheckCircle2,
    LockKeyhole,
    MapPin,
    Send,
    Users,
} from 'lucide-react';
import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/api-client';
import { ROLES } from '@/lib/constants';
import { setReturnUrl } from '@/lib/auth-redirect';
import { isJobSeekerPath, JOB_SEEKER_PATHS, PUBLIC_PATHS } from '@/lib/paths';
import { formatDate, formatSalary, titleCase } from '@/lib/utils';

export function JobDetailPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const location = useLocation();
    const { isAuthenticated, role } = useAuth();
    const queryClient = useQueryClient();
    const [applyOpen, setApplyOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeUuid, setResumeUuid] = useState<string>('');

    const isJobSeekerContext = isJobSeekerPath(location.pathname);
    const isPublicGuest = !isJobSeekerContext && !isAuthenticated;
    const backHref = isJobSeekerContext ? JOB_SEEKER_PATHS.jobs : PUBLIC_PATHS.jobs;
    const returnTo = location.pathname;

    const { data: job, isLoading, isError, refetch } = useQuery({
        queryKey: ['jobs', uuid],
        queryFn: () => jobsApi.get(uuid!),
        enabled: !!uuid && (isAuthenticated || isJobSeekerContext),
    });

    useEffect(() => {
        if (isPublicGuest) {
            setReturnUrl(returnTo);
            setAuthOpen(true);
        }
    }, [isPublicGuest, returnTo]);

    const { data: resumes = [] } = useQuery({
        queryKey: ['job-seeker', 'resumes'],
        queryFn: jobSeekerApi.resumes.list,
        enabled: isAuthenticated && role === ROLES.JOB_SEEKER && applyOpen,
    });

    const saveMutation = useMutation({
        mutationFn: () => jobSeekerApi.savedJobs.save(uuid!),
        onSuccess: () => {
            toast.success('Job saved');
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'saved-jobs'] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to save job')),
    });

    const applyMutation = useMutation({
        mutationFn: () =>
            jobSeekerApi.applications.apply(uuid!, {
                cover_letter: coverLetter || undefined,
                resume_uuid: resumeUuid || undefined,
            }),
        onSuccess: () => {
            toast.success('Application submitted successfully');
            setApplyOpen(false);
            setCoverLetter('');
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'applications'] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to apply')),
    });

    if (!uuid) return <ErrorState title="Invalid job" description="No job ID provided." />;

    if (isPublicGuest) {
        return (
            <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-header md:px-6 lg:px-8">
                <Button asChild variant="ghost" className="mb-8 gap-2 pl-0">
                    <Link to={backHref}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to jobs
                    </Link>
                </Button>
                <div className="animate-scale-in rounded-2xl border border-border/60 bg-card p-8 text-center shadow-elevation-2 md:p-12">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <LockKeyhole className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sign in to view job details</h1>
                    <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                        Please sign in to continue exploring TalentBridge. Unlock full job descriptions, salary
                        information, employer details, and one-click applications.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button size="lg" className="rounded-xl" onClick={() => setAuthOpen(true)}>
                            Sign in to continue
                        </Button>
                        <Button size="lg" variant="outline" asChild className="rounded-xl">
                            <Link to={PUBLIC_PATHS.register} state={{ from: returnTo }}>
                                Create free account
                            </Link>
                        </Button>
                    </div>
                </div>
                <AuthPromptDialog
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    returnTo={returnTo}
                    title="Sign in to view this job"
                    description="Please sign in to continue exploring TalentBridge."
                />
            </div>
        );
    }

    if (isLoading) return <LoadingSpinner label="Loading job details..." />;
    if (isError || !job) return <ErrorState title="Job not found" description="This job may have been removed." onRetry={() => refetch()} />;

    const locationStr = [job.location_city, job.location_state, job.location_country].filter(Boolean).join(', ');
    const canApply = isAuthenticated && role === ROLES.JOB_SEEKER;

    const content = (
        <div className="space-y-8">
            <Button asChild variant="ghost" className="gap-2 pl-0">
                <Link to={backHref}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to jobs
                </Link>
            </Button>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
                        {job.company && (
                            <div className="mt-2 flex items-center gap-2 text-lg text-muted-foreground">
                                <Building2 className="h-5 w-5" />
                                {job.company.name}
                            </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary">{titleCase(job.work_mode)}</Badge>
                            <Badge variant="outline">{titleCase(job.employment_type)}</Badge>
                            {job.experience_level && (
                                <Badge variant="outline">{titleCase(job.experience_level)}</Badge>
                            )}
                        </div>
                    </div>

                    {job.description && (
                        <section>
                            <h2 className="text-xl font-semibold">About the role</h2>
                            <div className="prose prose-sm mt-3 max-w-none text-muted-foreground dark:prose-invert">
                                <p className="whitespace-pre-wrap">{job.description}</p>
                            </div>
                        </section>
                    )}

                    {job.responsibilities && (
                        <section>
                            <h2 className="text-xl font-semibold">Responsibilities</h2>
                            <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{job.responsibilities}</p>
                        </section>
                    )}

                    {job.requirements && (
                        <section>
                            <h2 className="text-xl font-semibold">Requirements</h2>
                            <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{job.requirements}</p>
                        </section>
                    )}

                    {job.benefits && (
                        <section>
                            <h2 className="text-xl font-semibold">Benefits</h2>
                            <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{job.benefits}</p>
                        </section>
                    )}

                    {job.skills && job.skills.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold">Skills</h2>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <Badge key={skill.id} variant={skill.is_required ? 'default' : 'secondary'}>
                                        {skill.name}
                                        {skill.is_required && ' *'}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-4">
                    <Card className="sticky top-20 border-primary/20 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Job overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-2xl font-bold text-primary">
                                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.is_salary_visible)}
                                </p>
                                {job.salary_period && (
                                    <p className="text-xs text-muted-foreground">per {job.salary_period}</p>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-3 text-sm">
                                {locationStr && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span>{locationStr}</span>
                                    </div>
                                )}
                                {job.vacancies != null && (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{job.vacancies} opening{job.vacancies === 1 ? '' : 's'}</span>
                                    </div>
                                )}
                                {job.application_deadline && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>Apply by {formatDate(job.application_deadline)}</span>
                                    </div>
                                )}
                                {job.published_at && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                        <span>Posted {formatDate(job.published_at)}</span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {canApply ? (
                                <div className="space-y-2">
                                    <Button className="w-full" onClick={() => setApplyOpen(true)}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Apply now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled={saveMutation.isPending}
                                        onClick={() => saveMutation.mutate()}
                                    >
                                        <Bookmark className="mr-2 h-4 w-4" />
                                        Save job
                                    </Button>
                                </div>
                            ) : !isAuthenticated ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Sign in to apply and save this job.</p>
                                    <Button className="w-full rounded-xl" onClick={() => setAuthOpen(true)}>
                                        Sign in to apply
                                    </Button>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>
                            Submit your application to {job.company?.name ?? 'this employer'}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {resumes.length > 0 && (
                            <div className="space-y-2">
                                <Label>Resume</Label>
                                <Select value={resumeUuid} onValueChange={setResumeUuid}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a resume (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {resumes.map((r) => (
                                            <SelectItem key={r.uuid} value={r.uuid}>
                                                {r.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="cover-letter">Cover letter (optional)</Label>
                            <Textarea
                                id="cover-letter"
                                rows={5}
                                placeholder="Tell the employer why you're a great fit..."
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApplyOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={applyMutation.isPending} onClick={() => applyMutation.mutate()}>
                            {applyMutation.isPending ? 'Submitting...' : 'Submit application'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );

    if (isJobSeekerContext) {
        return content;
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-header md:px-6 lg:px-8">
            {content}
        </div>
    );
}
