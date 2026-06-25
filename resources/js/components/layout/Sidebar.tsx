import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { withIconDefaults } from '@/lib/icon-config';
import { AppLogo } from '@/components/common/AppLogo';

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
}

interface SidebarProps {
    items: NavItem[];
    collapsed?: boolean;
    onNavigate?: () => void;
}

/** Pick the most specific nav href that matches the current path (avoids /admin matching /admin/users). */
function getActiveNavHref(pathname: string, items: NavItem[]): string | null {
    const matches = items
        .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
        .sort((a, b) => b.href.length - a.href.length);

    return matches[0]?.href ?? null;
}

export function Sidebar({ items, collapsed, onNavigate }: SidebarProps) {
    const location = useLocation();
    const activeHref = getActiveNavHref(location.pathname, items);

    return (
        <aside
            className={cn(
                'flex h-screen min-h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar shadow-[1px_0_0_0_hsl(var(--sidebar-border))]',
                collapsed ? 'w-[4.5rem]' : 'w-64',
            )}
        >
            <div
                className={cn(
                    'flex h-16 shrink-0 items-center border-b border-sidebar-border bg-sidebar',
                    collapsed ? 'justify-center px-2' : 'px-5',
                )}
            >
                <AppLogo size="sm" showWordmark={!collapsed} />
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
                {items.map((item) => {
                    const isActive = item.href === activeHref;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            title={collapsed ? item.label : undefined}
                            onClick={onNavigate}
                            className={cn(
                                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground',
                            )}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                            )}
                            <span
                                className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-sidebar-accent/50 text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-foreground',
                                )}
                            >
                                <Icon {...withIconDefaults({ className: 'h-[17px] w-[17px]' })} />
                            </span>
                            {!collapsed && (
                                <>
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.badge != null && item.badge > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
