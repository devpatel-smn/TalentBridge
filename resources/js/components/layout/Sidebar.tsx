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
    subtitle?: string;
    onNavigate?: () => void;
}

function getActiveNavHref(pathname: string, items: NavItem[]): string | null {
    const matches = items
        .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
        .sort((a, b) => b.href.length - a.href.length);

    return matches[0]?.href ?? null;
}

export function Sidebar({ items, collapsed, subtitle, onNavigate }: SidebarProps) {
    const location = useLocation();
    const activeHref = getActiveNavHref(location.pathname, items);

    return (
        <aside
            className={cn(
                'flex h-screen min-h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar',
                collapsed ? 'w-[4.5rem]' : 'w-64',
            )}
        >
            <div
                className={cn(
                    'flex h-[4.5rem] shrink-0 flex-col justify-center border-b border-sidebar-border',
                    collapsed ? 'items-center px-2' : 'px-5',
                )}
            >
                <AppLogo size="sm" showWordmark={!collapsed} />
                {!collapsed && subtitle && (
                    <p className="mt-1 truncate text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {subtitle}
                    </p>
                )}
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
                                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-elevation-1'
                                    : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                            )}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-gold" />
                            )}
                            <span
                                className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-300',
                                    isActive
                                        ? 'bg-navy text-cream dark:bg-gold/15 dark:text-gold'
                                        : 'bg-sidebar-accent/40 text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-foreground',
                                )}
                            >
                                <Icon {...withIconDefaults({ className: 'h-[17px] w-[17px]' })} />
                            </span>
                            {!collapsed && (
                                <>
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.badge != null && item.badge > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-highlight px-1.5 text-[10px] font-bold text-highlight-foreground">
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
