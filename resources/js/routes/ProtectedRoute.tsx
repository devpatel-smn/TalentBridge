import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute() {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
        return <Navigate to={loginPath} replace state={{ from: location }} />;
    }

    if (!user?.email_verified_at && location.pathname !== '/verify-email') {
        return <Navigate to="/verify-email" replace />;
    }

    return <Outlet />;
}
