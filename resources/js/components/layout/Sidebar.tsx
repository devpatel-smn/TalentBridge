import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { withIconDefaults } from '@/lib/icon-config';

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
}

interface SidebarProps {
    items: NavItem[];
    collapsed?: boolean;
}

export function Sidebar({ items, collapsed }: SidebarProps) {
    const location = useLocation();

    return (
        <aside
            className={cn(
                'flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
                collapsed ? 'w-16' : 'w-64',
            )}
        >
            <nav className="flex-1 space-y-1 p-3">
                {items.map((item) => {
                    const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground',
                                )}
                            >
                                <Icon {...withIconDefaults({ className: 'h-[18px] w-[18px]' })} />
                            </span>
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge != null && item.badge > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                                            {item.badge}
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
