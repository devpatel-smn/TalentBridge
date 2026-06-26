import { useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/features/auth/api/auth-api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { normalizeAuthPathname, shouldSkipSessionBootstrap } from '@/lib/auth-paths';

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const { setUser, clearAuth } = useAuthStore();
    const skipSessionBootstrap = shouldSkipSessionBootstrap(normalizeAuthPathname(window.location.pathname));
    const [isInitializing, setIsInitializing] = useState(() => !skipSessionBootstrap);

    useEffect(() => {
        if (skipSessionBootstrap) {
            return;
        }

        let cancelled = false;

        const init = async () => {
            try {
                const user = await authApi.me();
                if (!cancelled) {
                    setUser(user);
                }
            } catch {
                if (!cancelled) {
                    clearAuth();
                }
            } finally {
                if (!cancelled) {
                    setIsInitializing(false);
                }
            }
        };

        void init();

        return () => {
            cancelled = true;
        };
    }, [setUser, clearAuth, skipSessionBootstrap]);

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
