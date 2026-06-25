export const PUBLIC_AUTH_PATHS = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/accept-team-invite',
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
