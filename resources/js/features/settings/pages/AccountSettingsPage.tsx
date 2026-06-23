import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/features/auth/api/auth-api';
import { changePasswordSchema, type ChangePasswordFormData } from '@/features/auth/schemas/auth-schemas';
import { getApiErrorMessage } from '@/lib/api-client';

export function AccountSettingsPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const mutation = useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            toast.success('Password updated successfully');
            reset();
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to update password')),
    });

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 md:px-6">
                <Button asChild variant="ghost" className="mb-4 gap-2 pl-0">
                    <Link to="/settings/profile">
                        <ArrowLeft className="h-4 w-4" />
                        Back to profile
                    </Link>
                </Button>

                <PageHeader
                    title="Account settings"
                    description="Manage your password and security preferences."
                />

                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <KeyRound className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Change password</CardTitle>
                                <CardDescription>
                                    Use a strong password with at least 8 characters.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Current password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="current_password"
                                        type="password"
                                        className="pl-9"
                                        {...register('current_password')}
                                    />
                                </div>
                                {errors.current_password && (
                                    <p className="text-sm text-destructive">{errors.current_password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9"
                                        {...register('password')}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm new password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        className="pl-9"
                                        {...register('password_confirmation')}
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Updating...' : 'Update password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
