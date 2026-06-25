import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute() {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.email_verified_at && location.pathname !== '/verify-email') {
        return <Navigate to="/verify-email" replace />;
    }

    return <Outlet />;
}
