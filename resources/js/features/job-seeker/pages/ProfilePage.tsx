import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { titleCase } from '@/lib/utils';
import type { EmploymentType, WorkMode } from '@/types/models';

const profileSchema = z.object({
    headline: z.string().max(255).optional(),
    summary: z.string().max(5000).optional(),
    current_title: z.string().max(255).optional(),
    years_of_experience: z.coerce.number().min(0).max(50).optional().nullable(),
    expected_salary_min: z.coerce.number().min(0).optional().nullable(),
    expected_salary_max: z.coerce.number().min(0).optional().nullable(),
    salary_currency: z.string().max(3).optional(),
    preferred_work_mode: z.enum(['onsite', 'remote', 'hybrid']).optional().nullable(),
    preferred_employment_type: z
        .enum(['full_time', 'part_time', 'contract', 'internship', 'temporary', 'freelance'])
        .optional()
        .nullable(),
    willing_to_relocate: z.boolean().optional(),
    location_city: z.string().max(100).optional(),
    location_state: z.string().max(100).optional(),
    location_country: z.string().max(100).optional(),
    linkedin_url: z.string().url().optional().or(z.literal('')),
    portfolio_url: z.string().url().optional().or(z.literal('')),
    is_open_to_work: z.boolean().optional(),
    is_profile_public: z.boolean().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const WORK_MODES: WorkMode[] = ['remote', 'hybrid', 'onsite'];
const EMPLOYMENT_TYPES: EmploymentType[] = ['full_time', 'part_time', 'contract', 'internship', 'temporary', 'freelance'];

export function ProfilePage() {
    const queryClient = useQueryClient();

    const { data: profile, isLoading, isError, refetch } = useQuery({
        queryKey: ['job-seeker', 'profile'],
        queryFn: jobSeekerApi.profile.get,
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (profile) {
            reset({
                headline: profile.headline ?? '',
                summary: profile.summary ?? '',
                current_title: profile.current_title ?? '',
                years_of_experience: profile.years_of_experience ?? undefined,
                expected_salary_min: profile.expected_salary_min ?? undefined,
                expected_salary_max: profile.expected_salary_max ?? undefined,
                salary_currency: profile.salary_currency ?? 'USD',
                preferred_work_mode: profile.preferred_work_mode ?? undefined,
                preferred_employment_type: profile.preferred_employment_type ?? undefined,
                willing_to_relocate: profile.willing_to_relocate ?? false,
                location_city: profile.location_city ?? '',
                location_state: profile.location_state ?? '',
                location_country: profile.location_country ?? '',
                linkedin_url: profile.linkedin_url ?? '',
                portfolio_url: profile.portfolio_url ?? '',
                is_open_to_work: profile.is_open_to_work ?? true,
                is_profile_public: profile.is_profile_public ?? true,
            });
        }
    }, [profile, reset]);

    const mutation = useMutation({
        mutationFn: jobSeekerApi.profile.update,
        onSuccess: () => {
            toast.success('Profile updated successfully');
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'profile'] });
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'dashboard'] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to update profile')),
    });

    if (isLoading) return <LoadingSpinner label="Loading profile..." />;
    if (isError) return <ErrorState title="Unable to load profile" onRetry={() => refetch()} />;

    const completion = profile?.profile_completion ?? 0;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Professional profile"
                description="Keep your profile up to date to attract the right employers."
            />

            <Card className="border-primary/20">
                <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Profile strength</p>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${completion}%` }}
                            />
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-primary">{completion}%</span>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic information</CardTitle>
                        <CardDescription>Tell employers about yourself and your career goals.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="headline">Headline</Label>
                            <Input id="headline" placeholder="e.g. Senior Software Engineer" {...register('headline')} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea id="summary" rows={4} placeholder="Brief professional summary..." {...register('summary')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current_title">Current title</Label>
                            <Input id="current_title" {...register('current_title')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="years_of_experience">Years of experience</Label>
                            <Input id="years_of_experience" type="number" min={0} {...register('years_of_experience')} />
                            {errors.years_of_experience && (
                                <p className="text-sm text-destructive">{errors.years_of_experience.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Preferred work mode</Label>
                            <Select
                                value={watch('preferred_work_mode') ?? ''}
                                onValueChange={(v) => setValue('preferred_work_mode', v as WorkMode, { shouldDirty: true })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select work mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WORK_MODES.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {titleCase(mode)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Preferred employment type</Label>
                            <Select
                                value={watch('preferred_employment_type') ?? ''}
                                onValueChange={(v) =>
                                    setValue('preferred_employment_type', v as EmploymentType, { shouldDirty: true })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EMPLOYMENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {titleCase(type)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expected_salary_min">Expected salary (min)</Label>
                            <Input id="expected_salary_min" type="number" {...register('expected_salary_min')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expected_salary_max">Expected salary (max)</Label>
                            <Input id="expected_salary_max" type="number" {...register('expected_salary_max')} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div>
                                <Label>Open to work</Label>
                                <p className="text-sm text-muted-foreground">Let employers know you&apos;re actively looking</p>
                            </div>
                            <Switch
                                checked={watch('is_open_to_work') ?? false}
                                onCheckedChange={(v) => setValue('is_open_to_work', v, { shouldDirty: true })}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div>
                                <Label>Public profile</Label>
                                <p className="text-sm text-muted-foreground">Make your profile visible to employers</p>
                            </div>
                            <Switch
                                checked={watch('is_profile_public') ?? false}
                                onCheckedChange={(v) => setValue('is_profile_public', v, { shouldDirty: true })}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                            <div>
                                <Label>Willing to relocate</Label>
                            </div>
                            <Switch
                                checked={watch('willing_to_relocate') ?? false}
                                onCheckedChange={(v) => setValue('willing_to_relocate', v, { shouldDirty: true })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Location & links</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="location_city">City</Label>
                            <Input id="location_city" {...register('location_city')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location_state">State / Region</Label>
                            <Input id="location_state" {...register('location_state')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location_country">Country</Label>
                            <Input id="location_country" {...register('location_country')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                            <Input id="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." {...register('linkedin_url')} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="portfolio_url">Portfolio URL</Label>
                            <Input id="portfolio_url" type="url" placeholder="https://..." {...register('portfolio_url')} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={mutation.isPending || !isDirty}>
                        {mutation.isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
