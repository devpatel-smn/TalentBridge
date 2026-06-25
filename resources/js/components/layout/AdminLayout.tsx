import {
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    ChartColumnBig,
    LayoutDashboard,
    ScrollText,
    Settings,
    Shield,
    UsersRound,
    Video,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { NavItem } from '@/components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

const adminNav: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Admins', href: '/admin/admins', icon: Shield },
    { label: 'Users', href: '/admin/users', icon: UsersRound },
    { label: 'Companies', href: '/admin/companies', icon: Building2 },
    { label: 'Jobs', href: '/admin/jobs', icon: BriefcaseBusiness },
    { label: 'Verifications', href: '/admin/verifications', icon: BadgeCheck },
    { label: 'Interviews', href: '/admin/interviews', icon: Video },
    { label: 'Analytics', href: '/admin/analytics', icon: ChartColumnBig },
    { label: 'Activity Logs', href: '/admin/activity-logs', icon: ScrollText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
    return (
        <DashboardLayout navItems={adminNav}>
            <Outlet />
        </DashboardLayout>
    );
}
