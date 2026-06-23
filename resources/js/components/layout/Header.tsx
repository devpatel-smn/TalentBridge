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
import { AppLogo } from '@/components/common/AppLogo';
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
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
            {showMenuButton && (
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <Menu {...withIconDefaults({ className: 'h-5 w-5' })} />
                </Button>
            )}

            <Link to="/" className="flex items-center gap-2 font-semibold">
                <AppLogo size="sm" showWordmark />
            </Link>

            <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                    {resolvedTheme === 'dark' ? (
                        <Sun {...withIconDefaults({ className: 'h-5 w-5' })} />
                    ) : (
                        <Moon {...withIconDefaults({ className: 'h-5 w-5' })} />
                    )}
                </Button>

                <NotificationBell />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 px-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {getInitials(user?.full_name ?? 'U')}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden max-w-[120px] truncate text-sm font-medium md:inline">
                                {user?.full_name}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span>{user?.full_name}</span>
                                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
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
