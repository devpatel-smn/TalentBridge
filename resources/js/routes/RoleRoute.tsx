import { Navigate, Outlet } from 'react-router-dom';
import { DASHBOARD_ROUTES, type UserRole } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

interface RoleRouteProps {
    allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const { role } = useAuth();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={DASHBOARD_ROUTES[role]} replace />;
    }

    return <Outlet />;
}
