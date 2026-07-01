import { Link } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { withIconDefaults } from '@/lib/icon-config';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/features/auth/api/auth-api';
import { getInitials } from '@/lib/utils';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

import type { WorkspaceVariant } from '@/components/layout/WorkspaceLayout';

interface HeaderProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
    variant?: WorkspaceVariant;
}

export function Header({ onMenuClick, showMenuButton, variant = 'seeker' }: HeaderProps) {
    const { user, clearAuth } = useAuth();

    const logoutRedirect = variant === 'admin' ? '/admin/login' : '/login';

    return (
        <header className="header-glass-light sticky top-0 z-40 flex h-[4.5rem] shrink-0 items-center gap-4 px-4 md:px-6">
            {showMenuButton && (
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} aria-label="Open menu">
                    <Menu {...withIconDefaults({ className: 'h-5 w-5' })} />
                </Button>
            )}

            <div className="ml-auto flex items-center gap-1.5">
                <NotificationBell />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2.5 rounded-xl px-2 hover:bg-header-border/40">
                            <Avatar className="h-8 w-8 ring-2 ring-border/60">
                                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                    {getInitials(user?.full_name ?? 'U')}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden max-w-[140px] truncate text-sm font-medium md:inline">
                                {user?.full_name}
                            </span>
                            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60 rounded-xl">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col gap-0.5">
                                <span className="font-semibold">{user?.full_name}</span>
                                <span className="text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/settings/profile">
                                <UserRound {...withIconDefaults({ className: 'mr-2 h-4 w-4' })} />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/settings/account">
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/notifications">
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={async () => {
                                try {
                                    await authApi.logout();
                                } catch {
                                    // Session may already be expired
                                }
                                clearAuth();
                                window.location.href = logoutRedirect;
                            }}
                            className="text-destructive focus:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
