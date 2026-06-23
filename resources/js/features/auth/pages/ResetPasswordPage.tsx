import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/features/auth/api/auth-api';
import { resetPasswordSchema } from '@/features/auth/schemas/auth-schemas';
import { getApiErrorMessage } from '@/lib/api-client';
import { z } from 'zod';

type ResetFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get('token') ?? '';
    const email = params.get('email') ?? '';

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

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Reset password</h2>
                <p className="text-muted-foreground">Enter your new password below</p>
            </div>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Resetting...' : 'Reset password'}
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
