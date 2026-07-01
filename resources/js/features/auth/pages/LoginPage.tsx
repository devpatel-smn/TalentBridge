import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLogo } from '@/components/common/AppLogo';
import { InputIcon } from '@/components/common/InputIcon';
import { FormField } from '@/components/forms/FormField';
import { authApi } from '@/features/auth/api/auth-api';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth-schemas';
import { useAuthStore } from '@/stores/auth-store';
import { DASHBOARD_ROUTES, ROLES } from '@/lib/constants';
import { getAndClearReturnUrl, peekReturnUrl } from '@/lib/auth-redirect';
import { getApiErrorMessage } from '@/lib/api-client';
import { PUBLIC_PATHS } from '@/lib/paths';

export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useAuthStore((s) => s.setUser);
    const stateFrom = (location.state as { from?: string } | null)?.from;
    const returnTo = stateFrom ?? peekReturnUrl();

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
            if (!user.email_verified_at) {
                toast.success('Signed in. Please verify your email to continue.');
                navigate('/verify-email');
                return;
            }

            toast.success('Welcome back!');
            const role = user.roles.includes(ROLES.ADMIN)
                ? ROLES.ADMIN
                : user.roles.includes(ROLES.EMPLOYER)
                  ? ROLES.EMPLOYER
                  : ROLES.JOB_SEEKER;
            const destination = stateFrom ?? getAndClearReturnUrl() ?? DASHBOARD_ROUTES[role];
            navigate(destination);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Login failed')),
    });

    return (
        <div className="space-y-7 animate-fade-in">
            <div className="flex flex-col items-center gap-3 lg:hidden">
                <Link to={PUBLIC_PATHS.home} className="transition-opacity duration-300 hover:opacity-85">
                    <AppLogo size="lg" showWordmark />
                </Link>
            </div>
            <div className="space-y-1.5 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {returnTo
                        ? 'Please sign in to continue exploring TalentBridge.'
                        : 'Enter your credentials to access your account'}
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
                            className="input-leading-icon rounded-xl"
                            aria-invalid={!!errors.email}
                            {...register('email')}
                        />
                    </div>
                </FormField>
                <FormField
                    label="Password"
                    htmlFor="password"
                    error={errors.password?.message}
                    required
                    labelAction={
                        <Link to="/forgot-password" className="shrink-0 text-xs font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    }
                >
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                            <InputIcon icon={LockKeyhole} />
                        </span>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="input-leading-icon input-trailing-icon rounded-xl"
                            aria-invalid={!!errors.password}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </FormField>
                <Button type="submit" className="h-11 w-full rounded-xl text-base" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
            <p className="pt-1 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                    to={PUBLIC_PATHS.register}
                    state={returnTo ? { from: returnTo } : undefined}
                    className="font-semibold text-primary hover:underline"
                >
                    Create account
                </Link>
            </p>
        </div>
    );
}
