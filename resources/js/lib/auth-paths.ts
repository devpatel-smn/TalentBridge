export const PUBLIC_AUTH_PATHS = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/accept-team-invite',
    '/admin/login',
] as const;

export const PUBLIC_MARKETING_PATHS = [
    '/',
    '/jobs',
    '/companies',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
] as const;

export const AUTH_PATHS_WITHOUT_SESSION_REDIRECT = [
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/accept-team-invite',
] as const;

export function normalizeAuthPathname(pathname: string): string {
    const normalized = pathname.replace(/\/+$/, '');

    return normalized === '' ? '/' : normalized;
}

export function isPublicAuthPath(pathname: string): boolean {
    return PUBLIC_AUTH_PATHS.includes(
        normalizeAuthPathname(pathname) as (typeof PUBLIC_AUTH_PATHS)[number],
    );
}

export function isAuthPathWithoutSessionRedirect(pathname: string): boolean {
    return AUTH_PATHS_WITHOUT_SESSION_REDIRECT.includes(
        normalizeAuthPathname(pathname) as (typeof AUTH_PATHS_WITHOUT_SESSION_REDIRECT)[number],
    );
}

export function isPublicMarketingPath(pathname: string): boolean {
    const normalized = normalizeAuthPathname(pathname);
    if (PUBLIC_MARKETING_PATHS.includes(normalized as (typeof PUBLIC_MARKETING_PATHS)[number])) {
        return true;
    }
    return (
        normalized.startsWith('/jobs/') ||
        normalized.startsWith('/companies/') ||
        normalized === '/login' ||
        normalized === '/register'
    );
}

export function shouldSkipSessionBootstrap(pathname: string): boolean {
    return isPublicAuthPath(pathname) || isPublicMarketingPath(pathname);
}
