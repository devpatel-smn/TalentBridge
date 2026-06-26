import { useState, type ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export type WorkspaceVariant = 'seeker' | 'employer' | 'admin';

interface WorkspaceLayoutProps {
    children: ReactNode;
    navItems: NavItem[];
    variant?: WorkspaceVariant;
    subtitle?: string;
}

const variantStyles: Record<WorkspaceVariant, string> = {
    seeker: 'workspace-seeker',
    employer: 'workspace-employer',
    admin: 'workspace-admin',
};

export function WorkspaceLayout({ children, navItems, variant = 'seeker', subtitle }: WorkspaceLayoutProps) {
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={cn('flex h-screen overflow-hidden bg-background', variantStyles[variant])}>
            {!isMobile && <Sidebar items={navItems} subtitle={subtitle} />}

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <Header showMenuButton={isMobile} onMenuClick={() => setSidebarOpen(true)} variant={variant} />

                {isMobile && sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                            aria-hidden="true"
                        />
                        <div className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl">
                            <Sidebar items={navItems} subtitle={subtitle} onNavigate={() => setSidebarOpen(false)} />
                        </div>
                    </>
                )}

                <main className="min-h-0 flex-1 overflow-y-auto bg-background">
                    <div className="mx-auto max-w-[90rem] animate-page-enter px-4 py-6 motion-reduce:animate-none md:px-8 md:py-7 lg:px-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
