import {
    Bookmark,
    FileText,
    LayoutDashboard,
    Search,
    Send,
    Sparkles,
    UserRound,
    Video,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { NavItem } from '@/components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

const jobSeekerNav: NavItem[] = [
    { label: 'Dashboard', href: '/job-seeker', icon: LayoutDashboard },
    { label: 'Job Search', href: '/job-seeker/jobs', icon: Search },
    { label: 'Applications', href: '/job-seeker/applications', icon: Send },
    { label: 'Saved Jobs', href: '/job-seeker/saved-jobs', icon: Bookmark },
    { label: 'Interviews', href: '/job-seeker/interviews', icon: Video },
    { label: 'Profile', href: '/job-seeker/profile', icon: UserRound },
    { label: 'Resume', href: '/job-seeker/resume', icon: FileText },
    { label: 'Recommendations', href: '/job-seeker/recommendations', icon: Sparkles },
];

export function JobSeekerLayout() {
    return (
        <DashboardLayout navItems={jobSeekerNav}>
            <Outlet />
        </DashboardLayout>
    );
}
