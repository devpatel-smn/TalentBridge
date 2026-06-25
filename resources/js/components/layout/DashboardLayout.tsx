import { useState, type ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface DashboardLayoutProps {
    children: ReactNode;
    navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {!isMobile && <Sidebar items={navItems} />}

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <Header showMenuButton={isMobile} onMenuClick={() => setSidebarOpen(true)} />

                {isMobile && sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                            aria-hidden="true"
                        />
                        <div className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl">
                            <Sidebar items={navItems} onNavigate={() => setSidebarOpen(false)} />
                        </div>
                    </>
                )}

                <main className="min-h-0 flex-1 overflow-y-auto bg-background">
                    <div className="mx-auto max-w-[90rem] animate-in px-4 py-6 md:px-8 md:py-8 lg:px-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
