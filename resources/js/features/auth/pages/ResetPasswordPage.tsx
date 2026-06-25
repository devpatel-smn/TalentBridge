import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/features/auth/api/auth-api';
import { resetPasswordSchema } from '@/features/auth/schemas/auth-schemas';
import { getApiErrorMessage } from '@/lib/api-client';
import { z } from 'zod';

type ResetFormData = z.infer<typeof resetPasswordSchema>;

function getResetLinkParams(search: string): { token: string; email: string } {
    const params = new URLSearchParams(search);

    return {
        token: params.get('token')?.trim() ?? '',
        email: params.get('email')?.trim() ?? '',
    };
}

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, email } = getResetLinkParams(location.search);
    const hasValidLink = Boolean(token && email);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFormData>({ resolver: zodResolver(resetPasswordSchema) });

    const mutation = useMutation({
        mutationFn: (data: ResetFormData) =>
            authApi.resetPassword({ ...data, token, email }),
        onSuccess: () => {
            toast.success('Password reset successfully');
            navigate('/login');
        },
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    if (!hasValidLink) {
        return (
            <div className="space-y-7">
                <div className="space-y-1.5 text-center lg:text-left">
                    <h2 className="text-2xl font-bold tracking-tight">Invalid reset link</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        This password reset link is missing required information or has expired.
                    </p>
                </div>
                <Button asChild className="h-11 w-full rounded-xl text-base">
                    <Link to="/forgot-password">Request a new reset link</Link>
                </Button>
                <p className="pt-1 text-center text-sm text-muted-foreground">
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Back to sign in
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-7">
            <div className="space-y-1.5 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Reset password</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">Enter your new password for {email}</p>
            </div>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
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
                    {mutation.isPending ? 'Resetting...' : 'Reset password'}
                </Button>
            </form>
            <p className="pt-1 text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
