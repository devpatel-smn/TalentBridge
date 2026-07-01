import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, UserRound } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
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

function getSectionTone(element: Element): 'dark' | 'light' | null {
    const section = element.closest('[data-section-tone]');
    if (section) {
        const tone = section.getAttribute('data-section-tone');
        if (tone === 'dark' || tone === 'light') return tone;
    }
    return null;
}

function getEffectiveLuminance(element: Element): number | null {
    let current: Element | null = element;

    while (current && current !== document.documentElement) {
        const tone = getSectionTone(current);
        if (tone === 'dark') return 0.1;
        if (tone === 'light') return 0.95;

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

function PublicNavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
    return (
        <Link
            to={to}
            data-active={active}
            className="nav-link-premium text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
        >
            <span className="nav-link-label">{label}</span>
            <span className="nav-link-underline" aria-hidden="true" />
        </Link>
    );
}

function MenuToggle({
    open,
    onClick,
    className,
}: {
    open: boolean;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            className={cn(
                'relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-foreground transition-colors hover:bg-foreground/5 lg:hidden',
                className,
            )}
            onClick={onClick}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
        >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                    className={cn(
                        'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        open ? 'top-[7px] rotate-45' : 'top-0',
                    )}
                />
                <span
                    className={cn(
                        'absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        open ? 'opacity-0 scale-x-0' : 'opacity-100',
                    )}
                />
                <span
                    className={cn(
                        'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        open ? 'top-[7px] -rotate-45' : 'top-[14px]',
                    )}
                />
            </span>
        </button>
    );
}

type HeaderMode = 'transparent' | 'glass' | 'solid';

export function PublicHeader() {
    const location = useLocation();
    const { isAuthenticated, role } = useAuth();
    const headerRootRef = useRef<HTMLDivElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [headerMode, setHeaderMode] = useState<HeaderMode>('transparent');
    const rafRef = useRef<number | null>(null);

    const dashboardHref = role ? DASHBOARD_ROUTES[role] : PUBLIC_PATHS.login;
    const profileHref = role === ROLES.JOB_SEEKER ? JOB_SEEKER_PATHS.profile : '/settings/profile';

    const updateHeaderState = useCallback(() => {
        const isScrolled = window.scrollY > 12;
        const darkBehind = isDarkBehindHeader(headerRootRef.current);

        if (mobileOpen || darkBehind) {
            setHeaderMode('solid');
        } else if (isScrolled) {
            setHeaderMode('glass');
        } else {
            setHeaderMode('transparent');
        }
    }, [mobileOpen]);

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                updateHeaderState();
                rafRef.current = null;
            });
        };

        updateHeaderState();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateHeaderState);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateHeaderState);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [updateHeaderState, location.pathname]);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const ghostClass = 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground min-h-[44px] min-w-[44px]';

    return (
        <div ref={headerRootRef} className="fixed inset-x-0 top-0 z-50 w-full">
            <header
                className={cn(
                    'relative',
                    headerMode === 'transparent' && 'border-b border-transparent bg-transparent',
                    headerMode === 'glass' && 'header-glass-scrolled',
                    headerMode === 'solid' && 'header-glass-solid',
                )}
            >
                <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 md:gap-4 md:px-6 lg:px-8">
                    <Link
                        to={PUBLIC_PATHS.home}
                        className="relative z-10 shrink-0 transition-opacity duration-300 hover:opacity-85"
                        onClick={() => setMobileOpen(false)}
                    >
                        <AppLogo size="sm" showWordmark variant="default" />
                    </Link>

                    <nav className="relative z-10 hidden items-center justify-center lg:flex" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <PublicNavLink
                                key={link.href}
                                to={link.href}
                                label={link.label}
                                active={isActive(location.pathname, link.href, link.exact)}
                            />
                        ))}
                    </nav>

                    <div className="relative z-10 flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
                        {isAuthenticated ? (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className={cn('hidden rounded-xl sm:inline-flex', ghostClass)}
                                >
                                    <Link to="/notifications" aria-label="Notifications">
                                        <Bell className="h-4 w-4" strokeWidth={1.75} />
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" className={cn('hidden rounded-xl md:inline-flex', ghostClass)}>
                                    <Link to={profileHref}>
                                        <UserRound className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
                                        Profile
                                    </Link>
                                </Button>
                                <Button asChild variant="gold" size="default" className="hidden sm:inline-flex">
                                    <Link to={dashboardHref}>Dashboard</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" className={cn('hidden rounded-xl sm:inline-flex', ghostClass)}>
                                    <Link to={PUBLIC_PATHS.login}>Login</Link>
                                </Button>
                                <Button asChild variant="gold" size="default" className="hidden sm:inline-flex">
                                    <Link to={PUBLIC_PATHS.register}>Get Started</Link>
                                </Button>
                            </>
                        )}

                        <MenuToggle open={mobileOpen} onClick={() => setMobileOpen((o) => !o)} />
                    </div>
                </div>

                <div
                    className={cn(
                        'relative z-10 overflow-hidden transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden',
                        mobileOpen ? 'max-h-[36rem] border-t border-border/80 opacity-100' : 'max-h-0 opacity-0',
                    )}
                    aria-hidden={!mobileOpen}
                >
                    <nav className="space-y-1 px-4 py-4" aria-label="Mobile navigation">
                        {navLinks.map((link) => {
                            const active = isActive(location.pathname, link.href, link.exact);
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    tabIndex={mobileOpen ? 0 : -1}
                                    className={cn(
                                        'flex min-h-[44px] items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-300',
                                        active
                                            ? 'bg-muted font-semibold text-foreground'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                            {isAuthenticated ? (
                                <>
                                    <Button asChild variant="gold" className="min-h-[44px]">
                                        <Link to={dashboardHref}>Dashboard</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="min-h-[44px] rounded-xl">
                                        <Link to="/notifications">Notifications</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="min-h-[44px] rounded-xl">
                                        <Link to={profileHref}>Profile</Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="outline" className="min-h-[44px] rounded-xl">
                                        <Link to={PUBLIC_PATHS.login}>Login</Link>
                                    </Button>
                                    <Button asChild variant="gold" className="min-h-[44px]">
                                        <Link to={PUBLIC_PATHS.register}>Get Started</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
}
