import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, COMPANY_ID_STORAGE_KEY, SANCTUM_CSRF_URL } from '@/lib/constants';
import type { ApiErrorResponse } from '@/types/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[2]) : null;
}

let csrfInitialized = false;

export async function ensureCsrfCookie(): Promise<void> {
    if (csrfInitialized) return;
    await axios.get(SANCTUM_CSRF_URL, { withCredentials: true });
    csrfInitialized = true;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }

    const companyId = localStorage.getItem(COMPANY_ID_STORAGE_KEY);
    if (companyId) {
        config.headers['X-Company-Id'] = companyId;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
    },
);

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const data = error.response?.data;
        if (data?.message) return data.message;
        if (data?.errors) {
            const first = Object.values(data.errors)[0];
            if (Array.isArray(first) && first[0]) return first[0];
            if (typeof first === 'string') return first;
        }
    }
    return fallback;
}

export function getValidationErrors(error: unknown): Record<string, string[]> | null {
    if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.data?.errors) {
        return error.response.data.errors as Record<string, string[]>;
    }
    return null;
}
