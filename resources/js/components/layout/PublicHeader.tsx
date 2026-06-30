import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, Moon, Sparkles, Sun, UserRound, X } from 'lucide-react';
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

function parseRgb(color: string): { r: number; g: number; b: number; a: number } | null {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: match[4] !== undefined ? Number(match[4]) : 1,
    };
}

function luminance(r: number, g: number, b: number) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getEffectiveLuminance(element: Element): number | null {
    let current: Element | null = element;

    while (current && current !== document.documentElement) {
        const { backgroundColor } = window.getComputedStyle(current);
        const rgb = parseRgb(backgroundColor);
        if (rgb && rgb.a > 0.12) {
            return luminance(rgb.r, rgb.g, rgb.b);
        }
        current = current.parentElement;
    }

    const bodyRgb = parseRgb(window.getComputedStyle(document.body).backgroundColor);
    return bodyRgb ? luminance(bodyRgb.r, bodyRgb.g, bodyRgb.b) : null;
}

function isDarkBehindHeader(headerRoot: HTMLElement | null) {
    if (!headerRoot) return false;

    const probeY = 36;
    const probeXs = [
        Math.round(window.innerWidth * 0.2),
        Math.round(window.innerWidth * 0.5),
        Math.round(window.innerWidth * 0.8),
    ];

    for (const x of probeXs) {
        const stack = document.elementsFromPoint(x, probeY);
        for (const element of stack) {
            if (headerRoot.contains(element)) continue;

            const value = getEffectiveLuminance(element);
            if (value !== null && value < 0.42) {
                return true;
            }
        }
    }

    return false;
}

function PublicNavLink({
    to,
    label,
    active,
    lightText,
}: {
    to: string;
    label: string;
    active: boolean;
    lightText: boolean;
}) {
    return (
        <Link
            to={to}
            className={cn(
                'px-4 py-2 text-sm font-light transition-colors duration-300',
                lightText
                    ? active
                        ? 'font-medium text-white'
                        : 'text-white/70 hover:text-white'
                    : active
                      ? 'font-medium text-foreground'
                      : 'text-foreground/70 hover:text-foreground',
            )}
        >
            {label}
        </Link>
    );
}

function HeaderCta({ href, label, accent }: { href: string; label: string; accent: string }) {
    return (
        <Link
            to={href}
            className="btn-magnetic inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground transition-colors hover:bg-navy/90 dark:bg-gold dark:text-gold-foreground dark:hover:bg-gold/90"
        >
            <Sparkles className="h-4 w-4 shrink-0 text-white" aria-hidden />
            <span>
                {label} <span className="text-gold">{accent}</span>
            </span>
        </Link>
    );
}

export function PublicHeader() {
    const location = useLocation();
    const { isAuthenticated, role } = useAuth();
    const { setTheme, resolvedTheme } = useTheme();
    const headerRootRef = useRef<HTMLDivElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lightText, setLightText] = useState(false);

    const dashboardHref = role ? DASHBOARD_ROUTES[role] : PUBLIC_PATHS.login;
    const profileHref = role === ROLES.JOB_SEEKER ? JOB_SEEKER_PATHS.profile : '/settings/profile';
    const showBlur = scrolled || mobileOpen;

    const updateHeaderState = useCallback(() => {
        const isScrolled = window.scrollY > 8;
        setScrolled(isScrolled);

        if (!isScrolled) {
            setLightText(false);
            return;
        }

        const darkBehind =
            resolvedTheme === 'dark' || isDarkBehindHeader(headerRootRef.current);
        setLightText(darkBehind);
    }, [resolvedTheme]);

    useEffect(() => {
        updateHeaderState();
        window.addEventListener('scroll', updateHeaderState, { passive: true });
        window.addEventListener('resize', updateHeaderState);

        const raf = requestAnimationFrame(updateHeaderState);
        const timer = window.setTimeout(updateHeaderState, 120);

        return () => {
            window.removeEventListener('scroll', updateHeaderState);
            window.removeEventListener('resize', updateHeaderState);
            cancelAnimationFrame(raf);
            window.clearTimeout(timer);
        };
    }, [updateHeaderState, location.pathname]);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const ghostClass = lightText
        ? 'text-white/70 hover:bg-white/10 hover:text-white'
        : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground';

    return (
        <div ref={headerRootRef} className="fixed inset-x-0 top-0 z-50 w-full">
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 bg-transparent transition-[opacity,backdrop-filter] duration-300 ease-out',
                    showBlur
                        ? 'opacity-100 backdrop-blur-[20px] backdrop-saturate-150'
                        : 'opacity-0 backdrop-blur-none',
                )}
            />

            <header
                className={cn(
                    'relative bg-transparent transition-[border-color] duration-300',
                    showBlur && (lightText ? 'border-b border-white/10' : 'border-b border-foreground/8'),
                )}
            >
                <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-6 lg:px-8">
                    <Link
                        to={PUBLIC_PATHS.home}
                        className="relative z-10 shrink-0 transition-opacity duration-300 hover:opacity-85"
                        onClick={() => setMobileOpen(false)}
                    >
                        <AppLogo size="sm" showWordmark variant={lightText ? 'light' : 'default'} />
                    </Link>

                    <nav className="relative z-10 hidden items-center justify-center lg:flex" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <PublicNavLink
                                key={link.href}
                                to={link.href}
                                label={link.label}
                                active={isActive(location.pathname, link.href, link.exact)}
                                lightText={lightText}
                            />
                        ))}
                    </nav>

                    <div className="relative z-10 flex items-center justify-end gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            aria-label="Toggle theme"
                            className={cn('rounded-full', ghostClass)}
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
                                    className={cn('hidden rounded-full sm:inline-flex', ghostClass)}
                                >
                                    <Link to="/notifications" aria-label="Notifications">
                                        <Bell className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" className={cn('hidden rounded-full md:inline-flex', ghostClass)}>
                                    <Link to={profileHref}>
                                        <UserRound className="mr-1.5 h-4 w-4" />
                                        Profile
                                    </Link>
                                </Button>
                                <div className="hidden sm:block">
                                    <HeaderCta href={dashboardHref} label="Go to" accent="Dashboard" />
                                </div>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" className={cn('hidden rounded-full sm:inline-flex', ghostClass)}>
                                    <Link to={PUBLIC_PATHS.login}>Login</Link>
                                </Button>
                                <div className="hidden sm:block">
                                    <HeaderCta href={PUBLIC_PATHS.register} label="Get" accent="Started" />
                                </div>
                            </>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn('rounded-full lg:hidden', lightText ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-foreground/5')}
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
                        'relative z-10 overflow-hidden bg-transparent transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden',
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
                                        'block rounded-lg px-4 py-3 text-sm font-light transition-colors duration-300',
                                        lightText
                                            ? active
                                                ? 'bg-white/12 font-medium text-white'
                                                : 'text-white/70 hover:bg-white/8 hover:text-white'
                                            : active
                                              ? 'bg-foreground/8 font-medium text-foreground'
                                              : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground',
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div
                            className={cn(
                                'mt-4 flex flex-col gap-2 border-t pt-4',
                                lightText ? 'border-white/10' : 'border-foreground/8',
                            )}
                        >
                            {isAuthenticated ? (
                                <>
                                    <HeaderCta href={dashboardHref} label="Go to" accent="Dashboard" />
                                    <Button
                                        asChild
                                        variant="outline"
                                        className={cn(
                                            'rounded-full',
                                            lightText
                                                ? 'border-white/20 text-white hover:bg-white/10'
                                                : 'border-foreground/15 text-foreground',
                                        )}
                                    >
                                        <Link to="/notifications">Notifications</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className={cn(
                                            'rounded-full',
                                            lightText
                                                ? 'border-white/20 text-white hover:bg-white/10'
                                                : 'border-foreground/15 text-foreground',
                                        )}
                                    >
                                        <Link to={profileHref}>Profile</Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className={cn(
                                            'rounded-full',
                                            lightText
                                                ? 'border-white/20 text-white hover:bg-white/10'
                                                : 'border-foreground/15 text-foreground',
                                        )}
                                    >
                                        <Link to={PUBLIC_PATHS.login}>Login</Link>
                                    </Button>
                                    <HeaderCta href={PUBLIC_PATHS.register} label="Get" accent="Started" />
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
}
