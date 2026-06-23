import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { employerApi } from '@/features/employer/api/employer-api';
import { getApiErrorMessage } from '@/lib/api-client';

const companyProfileSchema = z.object({
    name: z.string().min(1, 'Company name is required').max(255),
    description: z.string().optional(),
    website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    industry: z.string().max(100).optional(),
    company_size: z.string().max(50).optional(),
    founded_year: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional().or(z.literal('')),
    headquarters: z.string().max(255).optional(),
});

type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;

export function CompanyProfilePage() {
    const queryClient = useQueryClient();

    const { data: company, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'company'],
        queryFn: employerApi.company.get,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<CompanyProfileFormData>({
        resolver: zodResolver(companyProfileSchema),
    });

    useEffect(() => {
        if (company) {
            reset({
                name: company.name ?? '',
                description: company.description ?? '',
                website: company.website ?? '',
                industry: company.industry ?? '',
                company_size: company.company_size ?? '',
                founded_year: company.founded_year ?? '',
                headquarters: company.headquarters ?? '',
            });
        }
    }, [company, reset]);

    const mutation = useMutation({
        mutationFn: employerApi.company.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employer', 'company'] });
            queryClient.invalidateQueries({ queryKey: ['employer', 'dashboard'] });
            toast.success('Company profile updated');
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update profile')),
    });

    if (isLoading) {
        return <LoadingSpinner label="Loading company profile..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load company profile"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Company profile"
                description="Manage your company information visible to job seekers"
                actions={
                    company?.verification_status ? (
                        <StatusBadge status={company.verification_status} />
                    ) : undefined
                }
            />

            <form
                onSubmit={handleSubmit((formData) => {
                    mutation.mutate({
                        ...formData,
                        founded_year: formData.founded_year === '' ? null : Number(formData.founded_year),
                        website: formData.website || null,
                    });
                })}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Company details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="name">Company name</Label>
                                <Input id="name" {...register('name')} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" rows={4} {...register('description')} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" type="url" placeholder="https://example.com" {...register('website')} />
                                {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input id="industry" {...register('industry')} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company_size">Company size</Label>
                                <Input id="company_size" placeholder="e.g. 51-200" {...register('company_size')} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="founded_year">Founded year</Label>
                                <Input id="founded_year" type="number" {...register('founded_year')} />
                                {errors.founded_year && (
                                    <p className="text-sm text-destructive">{errors.founded_year.message}</p>
                                )}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="headquarters">Headquarters</Label>
                                <Input id="headquarters" placeholder="City, Country" {...register('headquarters')} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={!isDirty || mutation.isPending}
                                onClick={() =>
                                    company &&
                                    reset({
                                        name: company.name ?? '',
                                        description: company.description ?? '',
                                        website: company.website ?? '',
                                        industry: company.industry ?? '',
                                        company_size: company.company_size ?? '',
                                        founded_year: company.founded_year ?? '',
                                        headquarters: company.headquarters ?? '',
                                    })
                                }
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={mutation.isPending || !isDirty}>
                                {mutation.isPending ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
