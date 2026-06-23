import { Navigate, Outlet } from 'react-router-dom';
import { DASHBOARD_ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

export function GuestRoute() {
    const { isAuthenticated, role } = useAuth();

    if (isAuthenticated && role) {
        return <Navigate to={DASHBOARD_ROUTES[role]} replace />;
    }

    return <Outlet />;
}
