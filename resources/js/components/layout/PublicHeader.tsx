import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, Moon, Sun, UserRound, X } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { DASHBOARD_ROUTES, ROLES } from '@/lib/constants';
import { PUBLIC_PATHS, JOB_SEEKER_PATHS } from '@/lib/paths';
import { cn } from '@/lib/utils';

const navLinks = [
    { label: 'Home', href: PUBLIC_PATHS.home, exact: true },
    { label: 'Jobs', href: PUBLIC_PATHS.jobs },
    { label: 'Companies', href: PUBLIC_PATHS.companies },
    { label: 'About', href: PUBLIC_PATHS.about },
    { label: 'Contact', href: PUBLIC_PATHS.contact },
];

function isActive(pathname: string, href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
}

function PublicNavLink({
    to,
    label,
    active,
    variant,
}: {
    to: string;
    label: string;
    active: boolean;
    variant: 'dark' | 'light';
}) {
    return (
        <Link
            to={to}
            data-active={active}
            className={cn(
                'nav-link-premium',
                variant === 'dark'
                    ? active
                        ? 'text-white'
                        : 'text-white/60 hover:text-white'
                    : active
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
            )}
        >
            <span className="nav-link-label">{label}</span>
            <span className="nav-link-underline" aria-hidden />
        </Link>
    );
}

export function PublicHeader() {
    const location = useLocation();
    const { isAuthenticated, role } = useAuth();
    const { setTheme, resolvedTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const headerVariant = 'dark';

    const dashboardHref = role ? DASHBOARD_ROUTES[role] : PUBLIC_PATHS.login;
    const profileHref = role === ROLES.JOB_SEEKER ? JOB_SEEKER_PATHS.profile : '/settings/profile';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const ghostClass =
        headerVariant === 'dark'
            ? 'text-white/70 hover:bg-white/10 hover:text-white'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground';

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 w-full',
                headerVariant === 'dark' ? 'header-glass-dark' : 'header-glass-light',
                scrolled && 'is-scrolled',
            )}
        >
            <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-4 md:gap-8 md:px-6 lg:px-8">
                <Link
                    to={PUBLIC_PATHS.home}
                    className="mr-1 shrink-0 transition-opacity duration-300 hover:opacity-85"
                    onClick={() => setMobileOpen(false)}
                >
                    <AppLogo size="sm" showWordmark variant={headerVariant === 'dark' ? 'light' : 'default'} />
                </Link>

                <nav className="hidden items-center lg:flex" aria-label="Main navigation">
                    {navLinks.map((link) => (
                        <PublicNavLink
                            key={link.href}
                            to={link.href}
                            label={link.label}
                            active={isActive(location.pathname, link.href, link.exact)}
                            variant={headerVariant}
                        />
                    ))}
                </nav>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                        className={cn('rounded-lg', ghostClass)}
                    >
                        {resolvedTheme === 'dark' ? (
                            <Sun className="h-[18px] w-[18px]" />
                        ) : (
                            <Moon className="h-[18px] w-[18px]" />
                        )}
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className={cn('hidden rounded-lg sm:inline-flex', ghostClass)}
                            >
                                <Link to="/notifications" aria-label="Notifications">
                                    <Bell className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                className={cn('hidden rounded-lg md:inline-flex', ghostClass)}
                            >
                                <Link to={profileHref}>
                                    <UserRound className="mr-1.5 h-4 w-4" />
                                    Profile
                                </Link>
                            </Button>
                            <Button asChild className="btn-magnetic hidden rounded-lg sm:inline-flex bg-highlight text-highlight-foreground hover:bg-highlight/90">
                                <Link to={dashboardHref}>Dashboard</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                asChild
                                className={cn('hidden rounded-lg sm:inline-flex', ghostClass)}
                            >
                                <Link to={PUBLIC_PATHS.login}>Login</Link>
                            </Button>
                            <Button
                                asChild
                                className="btn-magnetic hidden rounded-lg sm:inline-flex bg-highlight text-highlight-foreground hover:bg-highlight/90"
                            >
                                <Link to={PUBLIC_PATHS.register}>Get started</Link>
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn('rounded-lg lg:hidden', ghostClass)}
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            <div
                className={cn(
                    'overflow-hidden border-t transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden',
                    headerVariant === 'dark' ? 'border-white/10' : 'border-border/60',
                    mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0',
                )}
            >
                <nav className="space-y-0.5 px-4 py-4" aria-label="Mobile navigation">
                    {navLinks.map((link) => {
                        const active = isActive(location.pathname, link.href, link.exact);
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={cn(
                                    'block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-300',
                                    active
                                        ? headerVariant === 'dark'
                                            ? 'bg-white/12 text-white'
                                            : 'bg-muted text-foreground'
                                        : headerVariant === 'dark'
                                          ? 'text-white/65 hover:bg-white/8 hover:text-white'
                                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <div
                        className={cn(
                            'mt-4 flex flex-col gap-2 border-t pt-4',
                            headerVariant === 'dark' ? 'border-white/10' : 'border-border/60',
                        )}
                    >
                        {isAuthenticated ? (
                            <>
                                <Button asChild className="btn-magnetic rounded-lg">
                                    <Link to={dashboardHref}>Dashboard</Link>
                                </Button>
                                <Button asChild variant="outline" className="rounded-lg">
                                    <Link to="/notifications">Notifications</Link>
                                </Button>
                                <Button asChild variant="outline" className="rounded-lg">
                                    <Link to={profileHref}>Profile</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="outline" className="rounded-lg">
                                    <Link to={PUBLIC_PATHS.login}>Login</Link>
                                </Button>
                                <Button asChild className="btn-magnetic rounded-lg bg-highlight text-highlight-foreground hover:bg-highlight/90">
                                    <Link to={PUBLIC_PATHS.register}>Get started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
