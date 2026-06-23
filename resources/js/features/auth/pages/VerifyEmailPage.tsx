import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authApi } from '@/features/auth/api/auth-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { Mail } from 'lucide-react';

export function VerifyEmailPage() {
    const mutation = useMutation({
        mutationFn: authApi.resendVerification,
        onSuccess: () => toast.success('Verification email sent'),
        onError: (error) => toast.error(getApiErrorMessage(error)),
    });

    return (
        <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Verify your email</h2>
                <p className="text-muted-foreground">
                    We sent a verification link to your email. Please check your inbox and click the link to activate
                    your account.
                </p>
            </div>
            <Button variant="outline" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Resend verification email'}
            </Button>
            <p className="text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
