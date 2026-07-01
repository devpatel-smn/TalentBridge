import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authApi } from '@/features/auth/api/auth-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth-store';

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const { isAuthenticated, role, user } = useAuth();
    const setUser = useAuthStore((s) => s.setUser);
    const status = searchParams.get('status');
    const isVerified = status === 'verified' || !!user?.email_verified_at;

    useEffect(() => {
        if (status === 'verified') {
            toast.success('Email address verified successfully.');
        } else if (status === 'invalid') {
            toast.error('Verification link is invalid or expired.');
        }
    }, [status]);

    useEffect(() => {
        if (status !== 'verified' || !isAuthenticated) return;

        void authApi
            .me()
            .then((nextUser) => setUser(nextUser))
            .catch(() => undefined);
    }, [isAuthenticated, setUser, status]);

    const mutation = useMutation({
        mutationFn: authApi.resendVerification,
        onSuccess: () => toast.success('Verification email sent'),
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    return (
        <div className="space-y-7 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight">Verify your email</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {user?.email ? (
                        <>
                            We sent a verification link to{' '}
                            <span className="font-medium text-foreground">{user.email}</span>. Please check your inbox
                            and click the link to activate your account.
                        </>
                    ) : (
                        <>
                            We sent a verification link to your email. Please check your inbox and click the link to
                            activate your account.
                        </>
                    )}
                </p>
            </div>
            {isVerified ? (
                role ? (
                    <Button asChild>
                        <Link to={DASHBOARD_ROUTES[role]}>Go to dashboard</Link>
                    </Button>
                ) : (
                    <Button asChild>
                        <Link to="/login">Sign in</Link>
                    </Button>
                )
            ) : isAuthenticated ? (
                <Button variant="outline" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Sending...' : 'Resend verification email'}
                </Button>
            ) : null}
            <p className="pt-1 text-sm text-muted-foreground">
                {isAuthenticated ? (
                    'Stay signed in while you verify your account.'
                ) : (
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Back to sign in
                    </Link>
                )}
            </p>
        </div>
    );
}
