import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLogo } from '@/components/common/AppLogo';
import { InputIcon } from '@/components/common/InputIcon';
import { authApi } from '@/features/auth/api/auth-api';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth-schemas';
import { useAuthStore } from '@/stores/auth-store';
import { DASHBOARD_ROUTES, ROLES } from '@/lib/constants';
import { getApiErrorMessage } from '@/lib/api-client';

export function LoginPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: async (user) => {
            setUser(user);
            toast.success('Welcome back!');
            const role = user.roles.includes(ROLES.ADMIN)
                ? ROLES.ADMIN
                : user.roles.includes(ROLES.EMPLOYER)
                  ? ROLES.EMPLOYER
                  : ROLES.JOB_SEEKER;
            navigate(DASHBOARD_ROUTES[role]);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Login failed')),
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 lg:hidden">
                <AppLogo size="lg" showWordmark />
            </div>
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                            <InputIcon icon={Mail} />
                        </span>
                        <Input id="email" type="email" placeholder="you@company.com" className="pl-10" {...register('email')} />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                            <InputIcon icon={LockKeyhole} />
                        </span>
                        <Input id="password" type="password" className="pl-10" {...register('password')} />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                    Create account
                </Link>
            </p>
        </div>
    );
}
