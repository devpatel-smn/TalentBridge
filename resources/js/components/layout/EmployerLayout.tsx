import {
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    ChartColumnBig,
    ClipboardList,
    LayoutDashboard,
    UsersRound,
    Video,
} from 'lucide-react';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import type { NavItem } from '@/components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

const employerNav: NavItem[] = [
    { label: 'Dashboard', href: '/employer', icon: LayoutDashboard },
    { label: 'Company Profile', href: '/employer/company', icon: Building2 },
    { label: 'Verification', href: '/employer/verification', icon: BadgeCheck },
    { label: 'Job Management', href: '/employer/jobs', icon: BriefcaseBusiness },
    { label: 'Applicants', href: '/employer/applicants', icon: ClipboardList },
    { label: 'Interviews', href: '/employer/interviews', icon: Video },
    { label: 'Team Members', href: '/employer/team', icon: UsersRound },
    { label: 'Analytics', href: '/employer/analytics', icon: ChartColumnBig },
];

export function EmployerLayout() {
    return (
        <WorkspaceLayout navItems={employerNav} variant="employer" subtitle="Hiring workspace">
            <Outlet />
        </WorkspaceLayout>
    );
}
