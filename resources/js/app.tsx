import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { router } from '@/routes';

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <QueryProvider>
                    <AuthProvider>
                        <Suspense
                            fallback={
                                <div className="flex min-h-screen items-center justify-center">
                                    <LoadingSpinner label="Loading TalentBridge..." />
                                </div>
                            }
                        >
                            <RouterProvider router={router} />
                        </Suspense>
                        <Toaster
                            position="top-right"
                            richColors
                            closeButton
                            toastOptions={{
                                classNames: {
                                    toast: 'rounded-xl border border-border/80 bg-card shadow-elevation-2',
                                },
                            }}
                        />
                    </AuthProvider>
                </QueryProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
