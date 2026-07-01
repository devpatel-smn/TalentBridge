import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Shield } from 'lucide-react';
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
import { getApiErrorMessage } from '@/lib/api-client';

export function AdminLoginPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);
    const clearAuth = useAuthStore((s) => s.clearAuth);

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
            if (!user.roles.includes(ROLES.ADMIN)) {
                try {
                    await authApi.logout();
                } catch {
                    // ignore
                }
                clearAuth();
                toast.error('This portal is for administrators only.');
                return;
            }

            setUser(user);

            if (!user.email_verified_at) {
                toast.success('Signed in. Please verify your email to continue.');
                navigate('/verify-email');
                return;
            }

            toast.success('Welcome back, Admin');
            navigate(DASHBOARD_ROUTES[ROLES.ADMIN]);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Login failed')),
    });

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface-sunken px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Shield className="h-7 w-7" />
                    </div>
                    <AppLogo size="lg" showWordmark />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
                        <p className="text-sm text-muted-foreground">Restricted access for platform administrators</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-elevation-2">
                    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                        <FormField label="Email" htmlFor="admin-email" error={errors.email?.message} required>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                                    <InputIcon icon={Mail} />
                                </span>
                                <Input
                                    id="admin-email"
                                    type="email"
                                    placeholder="admin@talentbridge.com"
                                    className="input-leading-icon rounded-xl"
                                    autoComplete="username"
                                    aria-invalid={!!errors.email}
                                    {...register('email')}
                                />
                            </div>
                        </FormField>
                        <FormField label="Password" htmlFor="admin-password" error={errors.password?.message} required>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                                    <InputIcon icon={LockKeyhole} />
                                </span>
                                <Input
                                    id="admin-password"
                                    type="password"
                                    className="input-leading-icon rounded-xl"
                                    autoComplete="current-password"
                                    aria-invalid={!!errors.password}
                                    {...register('password')}
                                />
                            </div>
                        </FormField>
                        <Button type="submit" className="h-11 w-full rounded-xl" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Signing in...' : 'Sign in to Admin'}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    <Link to="/" className="hover:text-foreground hover:underline">
                        ← Return to TalentBridge
                    </Link>
                </p>
            </div>
        </div>
    );
}
