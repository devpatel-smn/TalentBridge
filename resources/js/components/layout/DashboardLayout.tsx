import { useState, type ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface DashboardLayoutProps {
    children: ReactNode;
    navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <Header showMenuButton={isMobile} onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex flex-1">
                {!isMobile && <Sidebar items={navItems} />}
                {isMobile && sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/50"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="fixed inset-y-0 left-0 z-50 pt-16">
                            <Sidebar items={navItems} />
                        </div>
                    </>
                )}
                <main className={cn('flex-1 overflow-auto p-4 md:p-6 lg:p-8')}>
                    <div className="mx-auto max-w-7xl animate-in fade-in duration-500">{children}</div>
                </main>
            </div>
        </div>
    );
}
