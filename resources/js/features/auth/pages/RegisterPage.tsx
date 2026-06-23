import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authApi } from '@/features/auth/api/auth-api';
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/auth-schemas';
import { getApiErrorMessage } from '@/lib/api-client';
import { AppLogo } from '@/components/common/AppLogo';

export function RegisterPage() {
    const navigate = useNavigate();

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
        onSuccess: () => {
            toast.success('Account created! Please verify your email.');
            navigate('/verify-email');
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Registration failed')),
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 lg:hidden">
                <AppLogo size="lg" showWordmark />
            </div>
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
                <p className="text-muted-foreground">Join TalentBridge as an employer or job seeker</p>
            </div>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
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
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>I am a</Label>
                    <Select value={role} onValueChange={(v) => setValue('role', v as RegisterFormData['role'])}>
                        <SelectTrigger>
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
                        <Input id="company_name" {...register('company_name')} />
                        {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
                    </div>
                )}
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
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Creating account...' : 'Create account'}
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
