import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/features/auth/api/auth-api';
import { forgotPasswordSchema } from '@/features/auth/schemas/auth-schemas';
import { getApiErrorMessage } from '@/lib/api-client';
import { Mail } from 'lucide-react';
import { z } from 'zod';

type ForgotFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotFormData>({ resolver: zodResolver(forgotPasswordSchema) });

    const mutation = useMutation({
        mutationFn: (data: ForgotFormData) => authApi.forgotPassword(data.email),
        onSuccess: () => toast.success('If an account exists, a reset link has been sent.'),
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Forgot password</h2>
                <p className="text-muted-foreground">We&apos;ll send you a reset link if your account exists</p>
            </div>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    <Mail className="mr-2 h-4 w-4" />
                    {mutation.isPending ? 'Sending...' : 'Send reset link'}
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
