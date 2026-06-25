import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/features/auth/api/auth-api';
import { acceptTeamInviteSchema } from '@/features/auth/schemas/auth-schemas';
import { getApiErrorMessage } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { z } from 'zod';

type AcceptTeamInviteFormData = z.infer<typeof acceptTeamInviteSchema>;

function getInviteLinkParams(search: string): { token: string; email: string } {
    const params = new URLSearchParams(search);

    return {
        token: params.get('token')?.trim() ?? '',
        email: params.get('email')?.trim() ?? '',
    };
}

export function AcceptTeamInvitePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useAuthStore((s) => s.setUser);
    const { token, email } = getInviteLinkParams(location.search);
    const hasValidLink = Boolean(token && email);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AcceptTeamInviteFormData>({ resolver: zodResolver(acceptTeamInviteSchema) });

    const previewQuery = useQuery({
        queryKey: ['auth', 'team-invitation', token, email],
        queryFn: () => authApi.previewTeamInvitation({ token, email }),
        enabled: hasValidLink,
        retry: false,
    });

    const mutation = useMutation({
        mutationFn: (data: AcceptTeamInviteFormData) =>
            authApi.acceptTeamInvitation({ ...data, token, email }),
        onSuccess: (user) => {
            setUser(user);
            toast.success('Welcome to your employer workspace');
            navigate('/employer');
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to accept invitation')),
    });

    if (!hasValidLink) {
        return (
            <div className="space-y-7">
                <div className="space-y-1.5 text-center lg:text-left">
                    <h2 className="text-2xl font-bold tracking-tight">Invalid invitation link</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        This team invitation link is missing required information or has expired.
                    </p>
                </div>
                <Button asChild className="h-11 w-full rounded-xl text-base">
                    <Link to="/login">Go to sign in</Link>
                </Button>
            </div>
        );
    }

    if (previewQuery.isLoading) {
        return <LoadingSpinner label="Loading invitation..." />;
    }

    if (previewQuery.isError) {
        return (
            <div className="space-y-7">
                <div className="space-y-1.5 text-center lg:text-left">
                    <h2 className="text-2xl font-bold tracking-tight">Invitation unavailable</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {getApiErrorMessage(previewQuery.error, 'This invitation link is invalid or has expired.')}
                    </p>
                </div>
                <Button asChild className="h-11 w-full rounded-xl text-base">
                    <Link to="/login">Go to sign in</Link>
                </Button>
            </div>
        );
    }

    const preview = previewQuery.data;

    return (
        <div className="space-y-7">
            <div className="space-y-1.5 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Join {preview?.company.name}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {preview?.invited_by.full_name} invited you to collaborate on hiring at {preview?.company.name}.
                    {preview?.job_title ? ` Role: ${preview.job_title}.` : ''} Set up your account to continue.
                </p>
            </div>

            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="invite_email">Email</Label>
                    <Input id="invite_email" type="email" value={email} disabled />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="first_name">First name</Label>
                        <Input id="first_name" {...register('first_name')} />
                        {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input id="last_name" {...register('last_name')} />
                        {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register('password')} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <Input id="password_confirmation" type="password" {...register('password_confirmation')} />
                    {errors.password_confirmation && (
                        <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
                    )}
                </div>

                <Button type="submit" className="h-11 w-full rounded-xl text-base" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Setting up account...' : 'Accept invitation'}
                </Button>
            </form>

            <p className="pt-1 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
