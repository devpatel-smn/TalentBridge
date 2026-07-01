import { apiClient, ensureCsrfCookie } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/models';

export interface LoginPayload {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    role: 'employer' | 'job_seeker';
    company_name?: string;
}

export const authApi = {
    async login(payload: LoginPayload): Promise<User> {
        await ensureCsrfCookie();
        const { data } = await apiClient.post<ApiResponse<User>>('/auth/login', payload);
        return data.data;
    },

    async register(payload: RegisterPayload): Promise<User> {
        await ensureCsrfCookie();
        const { data } = await apiClient.post<ApiResponse<User>>('/auth/register', payload);
        return data.data;
    },

    async logout(): Promise<void> {
        await ensureCsrfCookie();
        await apiClient.post('/auth/logout');
        await ensureCsrfCookie();
    },

    async me(): Promise<User> {
        const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
        return data.data;
    },

    async forgotPassword(email: string): Promise<void> {
        await ensureCsrfCookie();
        await apiClient.post('/auth/forgot-password', { email });
    },

    async resetPassword(payload: {
        email: string;
        password: string;
        password_confirmation: string;
        token: string;
    }): Promise<void> {
        await ensureCsrfCookie();
        await apiClient.post('/auth/reset-password', payload);
    },

    async changePassword(payload: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }): Promise<void> {
        await apiClient.put('/auth/password', payload);
    },

    async resendVerification(): Promise<void> {
        await apiClient.post('/auth/email/verify/resend');
    },

    async previewTeamInvitation(payload: { token: string; email: string }) {
        const { data } = await apiClient.get<ApiResponse<{
            email: string;
            job_title: string | null;
            company: { name: string };
            invited_by: { full_name: string };
        }>>('/auth/team-invitations/preview', { params: payload });
        return data.data;
    },

    async acceptTeamInvitation(payload: {
        token: string;
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        password_confirmation: string;
    }): Promise<User> {
        await ensureCsrfCookie();
        const { data } = await apiClient.post<ApiResponse<User>>('/auth/team-invitations/accept', payload);
        return data.data;
    },
};
