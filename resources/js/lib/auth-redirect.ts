const RETURN_URL_KEY = 'talentbridge-return-url';

export function setReturnUrl(url: string): void {
    sessionStorage.setItem(RETURN_URL_KEY, url);
}

export function peekReturnUrl(): string | null {
    return sessionStorage.getItem(RETURN_URL_KEY);
}

export function getAndClearReturnUrl(): string | null {
    const url = sessionStorage.getItem(RETURN_URL_KEY);
    sessionStorage.removeItem(RETURN_URL_KEY);
    return url;
}

export function resolvePostAuthPath(fallback: string, stateFrom?: string): string {
    return stateFrom ?? peekReturnUrl() ?? fallback;
}
