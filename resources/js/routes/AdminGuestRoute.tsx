import { Navigate, Outlet } from 'react-router-dom';
import { DASHBOARD_ROUTES, ROLES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

export function AdminGuestRoute() {
    const { isAuthenticated, role } = useAuth();

    if (isAuthenticated && role === ROLES.ADMIN) {
        return <Navigate to={DASHBOARD_ROUTES[ROLES.ADMIN]} replace />;
    }

    return <Outlet />;
}
