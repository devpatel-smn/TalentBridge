import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { employerApi } from '@/features/employer/api/employer-api';
import { getApiErrorMessage } from '@/lib/api-client';
import type { EmploymentType, WorkMode } from '@/types/models';

const employmentTypes: EmploymentType[] = [
    'full_time',
    'part_time',
    'contract',
    'internship',
    'temporary',
    'freelance',
];

const workModes: WorkMode[] = ['onsite', 'remote', 'hybrid'];

const experienceLevels = ['entry', 'mid', 'senior', 'lead'] as const;
const salaryPeriods = ['hourly', 'monthly', 'yearly'] as const;

const jobFormSchema = z
    .object({
        title: z.string().min(1, 'Title is required').max(255),
        description: z.string().min(1, 'Description is required'),
        requirements: z.string().optional(),
        responsibilities: z.string().optional(),
        benefits: z.string().optional(),
        employment_type: z.enum([
            'full_time',
            'part_time',
            'contract',
            'internship',
            'temporary',
            'freelance',
        ]),
        work_mode: z.enum(['onsite', 'remote', 'hybrid']),
        experience_level: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
        salary_min: z.coerce.number().min(0).optional().or(z.literal('')),
        salary_max: z.coerce.number().min(0).optional().or(z.literal('')),
        salary_currency: z.string().length(3).optional(),
        salary_period: z.enum(['hourly', 'monthly', 'yearly']).optional(),
        is_salary_visible: z.boolean().optional(),
        location_city: z.string().max(100).optional(),
        location_state: z.string().max(100).optional(),
        location_country: z.string().max(100).optional(),
        application_deadline: z.string().optional(),
        vacancies: z.coerce.number().int().min(1).max(1000).optional(),
    })
    .refine(
        (data) => {
            if (data.salary_min === '' || data.salary_max === '') return true;
            if (data.salary_min == null || data.salary_max == null) return true;
            return Number(data.salary_max) >= Number(data.salary_min);
        },
        { message: 'Maximum salary must be greater than or equal to minimum', path: ['salary_max'] },
    );

type JobFormData = z.infer<typeof jobFormSchema>;

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function EmployerJobFormPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(uuid);

    const {
        data: job,
        isLoading: isLoadingJob,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['employer', 'jobs', uuid],
        queryFn: () => employerApi.jobs.get(uuid!),
        enabled: isEdit,
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<JobFormData>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: {
            title: '',
            description: '',
            employment_type: 'full_time',
            work_mode: 'onsite',
            salary_currency: 'USD',
            salary_period: 'yearly',
            is_salary_visible: true,
            vacancies: 1,
        },
    });

    useEffect(() => {
        if (job) {
            reset({
                title: job.title,
                description: job.description ?? '',
                requirements: job.requirements ?? '',
                responsibilities: job.responsibilities ?? '',
                benefits: job.benefits ?? '',
                employment_type: job.employment_type,
                work_mode: job.work_mode,
                experience_level: (job.experience_level as JobFormData['experience_level']) ?? undefined,
                salary_min: job.salary_min ?? '',
                salary_max: job.salary_max ?? '',
                salary_currency: job.salary_currency ?? 'USD',
                salary_period: (job.salary_period as JobFormData['salary_period']) ?? 'yearly',
                is_salary_visible: job.is_salary_visible ?? true,
                location_city: job.location_city ?? '',
                location_state: job.location_state ?? '',
                location_country: job.location_country ?? '',
                application_deadline: job.application_deadline?.slice(0, 10) ?? '',
                vacancies: job.vacancies ?? 1,
            });
        }
    }, [job, reset]);

    const mutation = useMutation({
        mutationFn: (formData: JobFormData) => {
            const payload = {
                ...formData,
                salary_min: formData.salary_min === '' ? null : Number(formData.salary_min),
                salary_max: formData.salary_max === '' ? null : Number(formData.salary_max),
                application_deadline: formData.application_deadline || null,
            };
            return isEdit ? employerApi.jobs.update(uuid!, payload) : employerApi.jobs.create(payload);
        },
        onSuccess: (savedJob) => {
            queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['employer', 'dashboard'] });
            toast.success(isEdit ? 'Job updated' : 'Job created');
            navigate(`/employer/jobs/${savedJob.uuid}/edit`);
        },
        onError: (err) => toast.error(getApiErrorMessage(err, isEdit ? 'Failed to update job' : 'Failed to create job')),
    });

    if (isEdit && isLoadingJob) {
        return <LoadingSpinner label="Loading job..." />;
    }

    if (isEdit && isError) {
        return (
            <ErrorState
                title="Failed to load job"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={isEdit ? 'Edit job' : 'Create job'}
                description={isEdit ? 'Update your job posting details' : 'Post a new job opening'}
                actions={
                    <Button variant="outline" asChild>
                        <Link to="/employer/jobs">Back to jobs</Link>
                    </Button>
                }
            />

            <form onSubmit={handleSubmit((formData) => mutation.mutate(formData))} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job title</Label>
                            <Input id="title" {...register('title')} />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" rows={5} {...register('description')} />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Employment type</Label>
                                <Controller
                                    name="employment_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employmentTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {formatLabel(type)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Work mode</Label>
                                <Controller
                                    name="work_mode"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {workModes.map((mode) => (
                                                    <SelectItem key={mode} value={mode}>
                                                        {formatLabel(mode)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Experience level</Label>
                                <Controller
                                    name="experience_level"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {experienceLevels.map((level) => (
                                                    <SelectItem key={level} value={level}>
                                                        {formatLabel(level)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vacancies">Vacancies</Label>
                                <Input id="vacancies" type="number" min={1} {...register('vacancies')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements</Label>
                            <Textarea id="requirements" rows={3} {...register('requirements')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="responsibilities">Responsibilities</Label>
                            <Textarea id="responsibilities" rows={3} {...register('responsibilities')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="benefits">Benefits</Label>
                            <Textarea id="benefits" rows={3} {...register('benefits')} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Compensation & location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary_min">Min salary</Label>
                                <Input id="salary_min" type="number" min={0} {...register('salary_min')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary_max">Max salary</Label>
                                <Input id="salary_max" type="number" min={0} {...register('salary_max')} />
                                {errors.salary_max && (
                                    <p className="text-sm text-destructive">{errors.salary_max.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary_currency">Currency</Label>
                                <Input id="salary_currency" maxLength={3} {...register('salary_currency')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Salary period</Label>
                                <Controller
                                    name="salary_period"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value ?? 'yearly'} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {salaryPeriods.map((period) => (
                                                    <SelectItem key={period} value={period}>
                                                        {formatLabel(period)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="location_city">City</Label>
                                <Input id="location_city" {...register('location_city')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location_state">State</Label>
                                <Input id="location_state" {...register('location_state')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location_country">Country</Label>
                                <Input id="location_country" {...register('location_country')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="application_deadline">Application deadline</Label>
                            <Input id="application_deadline" type="date" {...register('application_deadline')} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" asChild>
                        <Link to="/employer/jobs">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : isEdit ? 'Update job' : 'Create job'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
