import { Link } from 'react-router-dom';
import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    UserRound,
} from 'lucide-react';
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
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/features/auth/api/auth-api';
import { getInitials } from '@/lib/utils';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

interface HeaderProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton }: HeaderProps) {
    const { user, clearAuth } = useAuth();
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-header-border bg-header px-4 shadow-sm md:px-6">
            {showMenuButton && (
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} aria-label="Open menu">
                    <Menu {...withIconDefaults({ className: 'h-5 w-5' })} />
                </Button>
            )}

            <div className="ml-auto flex items-center gap-1.5">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="rounded-xl text-muted-foreground hover:bg-header-border/40 hover:text-foreground"
                >
                    {resolvedTheme === 'dark' ? (
                        <Sun {...withIconDefaults({ className: 'h-[18px] w-[18px]' })} />
                    ) : (
                        <Moon {...withIconDefaults({ className: 'h-[18px] w-[18px]' })} />
                    )}
                </Button>

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
                                window.location.href = '/login';
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
