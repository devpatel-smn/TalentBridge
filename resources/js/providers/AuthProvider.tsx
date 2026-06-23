import { useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/features/auth/api/auth-api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const { setUser, clearAuth } = useAuthStore();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await authApi.me();
                setUser(user);
            } catch {
                clearAuth();
            } finally {
                setIsInitializing(false);
            }
        };
        void init();
    }, [setUser, clearAuth]);

    useEffect(() => {
        const handler = () => {
            clearAuth();
            queryClient.clear();
        };
        window.addEventListener('auth:unauthorized', handler);
        return () => window.removeEventListener('auth:unauthorized', handler);
    }, [clearAuth, queryClient]);

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner label="Loading TalentBridge..." />
            </div>
        );
    }

    return <>{children}</>;
}
