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
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import type { NavItem } from '@/components/layout/Sidebar';
import { JOB_SEEKER_PATHS } from '@/lib/paths';
import { Outlet } from 'react-router-dom';

const jobSeekerNav: NavItem[] = [
    { label: 'Dashboard', href: JOB_SEEKER_PATHS.dashboard, icon: LayoutDashboard },
    { label: 'Search Jobs', href: JOB_SEEKER_PATHS.jobs, icon: Search },
    { label: 'Applications', href: JOB_SEEKER_PATHS.applications, icon: Send },
    { label: 'Saved Jobs', href: JOB_SEEKER_PATHS.savedJobs, icon: Bookmark },
    { label: 'Interviews', href: JOB_SEEKER_PATHS.interviews, icon: Video },
    { label: 'Profile', href: JOB_SEEKER_PATHS.profile, icon: UserRound },
    { label: 'Resume', href: JOB_SEEKER_PATHS.resume, icon: FileText },
    { label: 'Recommendations', href: JOB_SEEKER_PATHS.recommendations, icon: Sparkles },
];

export function JobSeekerLayout() {
    return (
        <WorkspaceLayout navItems={jobSeekerNav} variant="seeker" subtitle="Career workspace">
            <Outlet />
        </WorkspaceLayout>
    );
}
