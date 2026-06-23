import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { router } from '@/routes';

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <QueryProvider>
                    <AuthProvider>
                        <RouterProvider router={router} />
                        <Toaster
                            position="top-right"
                            richColors
                            closeButton
                            toastOptions={{
                                classNames: {
                                    toast: 'glass shadow-lg',
                                },
                            }}
                        />
                    </AuthProvider>
                </QueryProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
