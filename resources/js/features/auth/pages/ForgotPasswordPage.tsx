import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLogo } from '@/components/common/AppLogo';
import { InputIcon } from '@/components/common/InputIcon';
import { FormField } from '@/components/forms/FormField';
import { authApi } from '@/features/auth/api/auth-api';
import { forgotPasswordSchema } from '@/features/auth/schemas/auth-schemas';
import { getApiErrorMessage } from '@/lib/api-client';

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
        <div className="space-y-7">
            <div className="flex flex-col items-center gap-3 lg:hidden">
                <AppLogo size="lg" showWordmark />
            </div>
            <div className="space-y-1.5 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Forgot password</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    We&apos;ll send you a reset link if your account exists
                </p>
            </div>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                            <InputIcon icon={Mail} />
                        </span>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            className="rounded-xl pl-10"
                            aria-invalid={!!errors.email}
                            {...register('email')}
                        />
                    </div>
                </FormField>
                <Button type="submit" className="h-11 w-full rounded-xl text-base" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Sending...' : 'Send reset link'}
                </Button>
            </form>
            <p className="pt-1 text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-semibold text-primary hover:underline">
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
