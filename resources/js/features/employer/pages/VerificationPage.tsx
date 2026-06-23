import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { employerApi } from '@/features/employer/api/employer-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';

interface VerificationRecord {
    id?: number;
    status?: string;
    business_registration_number?: string | null;
    tax_id?: string | null;
    notes?: string | null;
    rejection_reason?: string | null;
    reviewed_at?: string | null;
    created_at?: string | null;
}

const verificationSchema = z
    .object({
        business_registration_number: z.string().max(100).optional(),
        tax_id: z.string().max(100).optional(),
        notes: z.string().max(2000).optional(),
    })
    .refine(
        (data) => !!(data.business_registration_number?.trim() || data.tax_id?.trim()),
        { message: 'Provide a business registration number or tax ID', path: ['business_registration_number'] },
    );

type VerificationFormData = z.infer<typeof verificationSchema>;

const PENDING_STATUSES = ['pending', 'under_review'];
const BLOCKED_STATUSES = ['approved', 'pending', 'under_review'];

export function VerificationPage() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employer', 'verification'],
        queryFn: employerApi.verification.get,
    });

    const verification = data as VerificationRecord | null | undefined;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerificationFormData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            business_registration_number: '',
            tax_id: '',
            notes: '',
        },
    });

    const mutation = useMutation({
        mutationFn: employerApi.verification.submit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employer', 'verification'] });
            queryClient.invalidateQueries({ queryKey: ['employer', 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['employer', 'company'] });
            toast.success('Verification submitted for review');
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to submit verification')),
    });

    if (isLoading) {
        return <LoadingSpinner label="Loading verification status..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load verification"
                description={getApiErrorMessage(error)}
                onRetry={() => refetch()}
            />
        );
    }

    const canSubmit = !verification?.status || !BLOCKED_STATUSES.includes(verification.status);
    const isPending = verification?.status && PENDING_STATUSES.includes(verification.status);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Company verification"
                description="Submit your business details for verification"
            />

            {verification?.status && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ShieldCheck className="h-5 w-5" />
                            Current status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={verification.status} />
                            {verification.created_at && (
                                <span className="text-sm text-muted-foreground">
                                    Submitted {formatDateTime(verification.created_at)}
                                </span>
                            )}
                        </div>
                        {verification.rejection_reason && (
                            <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                                {verification.rejection_reason}
                            </p>
                        )}
                        {isPending && (
                            <p className="text-sm text-muted-foreground">
                                Your submission is being reviewed. You will be notified once a decision is made.
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {verification?.status === 'approved' ? (
                <EmptyState
                    icon={<ShieldCheck className="h-6 w-6 text-success" />}
                    title="Company verified"
                    description="Your company has been verified. No further action is required."
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Submit verification</CardTitle>
                        <CardDescription>
                            Provide your business registration number, tax ID, or supporting documentation notes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {canSubmit ? (
                            <form
                                onSubmit={handleSubmit((formData) => mutation.mutate(formData))}
                                className="space-y-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="business_registration_number">
                                            Business registration number
                                        </Label>
                                        <Input
                                            id="business_registration_number"
                                            {...register('business_registration_number')}
                                        />
                                        {errors.business_registration_number && (
                                            <p className="text-sm text-destructive">
                                                {errors.business_registration_number.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tax_id">Tax ID</Label>
                                        <Input id="tax_id" {...register('tax_id')} />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="notes">Additional notes</Label>
                                        <Textarea
                                            id="notes"
                                            rows={4}
                                            placeholder="Any additional information for the review team..."
                                            {...register('notes')}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={mutation.isPending}>
                                        {mutation.isPending ? 'Submitting...' : 'Submit for review'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <EmptyState
                                title="Submission under review"
                                description="You cannot submit a new verification while your current submission is being processed."
                            />
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
