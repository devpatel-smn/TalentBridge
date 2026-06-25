import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { DASHBOARD_ROUTES } from '@/lib/constants';
import { isAuthPathWithoutSessionRedirect } from '@/lib/auth-paths';
import { useAuth } from '@/hooks/useAuth';

export function GuestRoute() {
    const location = useLocation();
    const { isAuthenticated, role, user } = useAuth();

    if (isAuthPathWithoutSessionRedirect(location.pathname)) {
        return <Outlet />;
    }

    if (isAuthenticated && role && !user?.email_verified_at && location.pathname === '/verify-email') {
        return <Outlet />;
    }

    if (isAuthenticated && role) {
        return <Navigate to={DASHBOARD_ROUTES[role]} replace />;
    }

    return <Outlet />;
}
