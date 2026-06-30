import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authApi } from '@/features/auth/api/auth-api';
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/auth-schemas';
import { peekReturnUrl } from '@/lib/auth-redirect';
import { PUBLIC_PATHS } from '@/lib/paths';
import { AppLogo } from '@/components/common/AppLogo';
import { useAuthStore } from '@/stores/auth-store';
import { getApiErrorMessage } from '@/lib/api-client';

function toRegisterPayload(data: RegisterFormData) {
    const { city: _city, state: _state, zip: _zip, country: _country, ...payload } = data;
    return payload;
}

export function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useAuthStore((s) => s.setUser);
    const stateFrom = (location.state as { from?: string } | null)?.from;
    const returnTo = stateFrom ?? peekReturnUrl();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'job_seeker' },
    });

    const role = watch('role');

    const mutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (user) => {
            setUser(user);
            toast.success('Account created! Please verify your email.');
            if (returnTo) {
                navigate('/verify-email', { state: { from: returnTo } });
            } else {
                navigate('/verify-email');
            }
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Registration failed')),
    });

    return (
        <div className="space-y-7">
            <div className="flex flex-col items-center gap-2 lg:hidden">
                <Link to={PUBLIC_PATHS.home} className="transition-opacity duration-300 hover:opacity-85">
                    <AppLogo size="lg" showWordmark />
                </Link>
            </div>
            <div className="space-y-1.5 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {returnTo
                        ? 'Please sign in to continue exploring TalentBridge.'
                        : 'Join TalentBridge as an employer or job seeker'}
                </p>
            </div>
            <form
                onSubmit={handleSubmit((data) => mutation.mutate(toRegisterPayload(data)))}
                className="space-y-5"
            >
                <div className="grid gap-5 lg:grid-cols-2 lg:gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="first_name">First name</Label>
                        <Input id="first_name" className="h-9" {...register('first_name')} />
                        {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input id="last_name" className="h-9" {...register('last_name')} />
                        {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="h-9" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>I am a</Label>
                    <Select value={role} onValueChange={(v) => setValue('role', v as RegisterFormData['role'])}>
                        <SelectTrigger className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="job_seeker">Job Seeker</SelectItem>
                            <SelectItem value="employer">Employer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {role === 'employer' && (
                    <div className="space-y-2">
                        <Label htmlFor="company_name">Company name</Label>
                        <Input id="company_name" className="h-9" {...register('company_name')} />
                        {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input id="phone" type="tel" className="h-9" {...register('phone')} />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="grid gap-5 lg:grid-cols-2 lg:gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" className="h-9" {...register('city')} />
                        {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State / Province</Label>
                        <Input id="state" className="h-9" {...register('state')} />
                        {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                    </div>
                </div>
                <div className="grid gap-5 lg:grid-cols-2 lg:gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="zip">ZIP / Postal code</Label>
                        <Input id="zip" className="h-9" {...register('zip')} />
                        {errors.zip && <p className="text-sm text-destructive">{errors.zip.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" className="h-9" {...register('country')} />
                        {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="h-9 pr-10"
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="h-9 pr-10"
                            {...register('password_confirmation')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
                    )}
                </div>
                <Button type="submit" className="h-11 w-full rounded-xl text-base" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Creating account...' : 'Create account'}
                </Button>
            </form>
            <p className="pt-1 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    to={PUBLIC_PATHS.login}
                    state={returnTo ? { from: returnTo } : undefined}
                    className="font-medium text-primary hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
