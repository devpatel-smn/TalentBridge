import { apiClient } from '@/lib/api-client';
import type { ApiResponse, ListParams } from '@/types/api';

function buildQuery(params?: ListParams) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.per_page) sp.set('per_page', String(params.per_page));
    if (params?.search) sp.set('search', params.search);
    if (params?.sort) sp.set('sort', params.sort);
    if (params?.order) sp.set('order', params.order);
    if (params?.filter) {
        Object.entries(params.filter).forEach(([k, v]) => {
            if (v !== undefined) sp.set(`filter[${k}]`, String(v));
        });
    }
    return sp.toString();
}

export const adminApi = {
    dashboard: async () => {
        const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>('/admin/dashboard');
        return data.data;
    },
    users: async (params?: ListParams) => {
        const { data } = await apiClient.get(`/admin/users?${buildQuery(params)}`);
        return data;
    },
    user: async (id: number) => {
        const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/admin/users/${id}`);
        return data.data;
    },
    createUser: async (payload: Record<string, unknown>) => {
        const { data } = await apiClient.post<ApiResponse<Record<string, unknown>>>('/admin/users', payload);
        return data.data;
    },
    updateUser: async (id: number, payload: Record<string, unknown>) => {
        const { data } = await apiClient.put<ApiResponse<Record<string, unknown>>>(`/admin/users/${id}`, payload);
        return data.data;
    },
    updateUserStatus: async (id: number, status: string) => {
        await apiClient.patch(`/admin/users/${id}/status`, { status });
    },
    jobSeekers: async (params?: ListParams) => {
        const { data } = await apiClient.get(`/admin/job-seekers?${buildQuery(params)}`);
        return data;
    },
    jobSeeker: async (uuid: string) => {
        const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/admin/job-seekers/${uuid}`);
        return data.data;
    },
    companies: async (params?: ListParams) => {
        const { data } = await apiClient.get(`/admin/companies?${buildQuery(params)}`);
        return data;
    },
    company: async (uuid: string) => {
        const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/admin/companies/${uuid}`);
        return data.data;
    },
    jobs: async (params?: ListParams) => {
        const { data } = await apiClient.get(`/admin/jobs?${buildQuery(params)}`);
        return data;
    },
    verifications: async (params?: ListParams) => {
        const { data } = await apiClient.get(`/admin/verifications?${buildQuery(params)}`);
        return data;
    },
    reviewVerification: async (id: number, payload: Record<string, unknown>) => {
        await apiClient.patch(`/admin/verifications/${id}`, payload);
    },
    interviews: async (params?: ListParams) => {
        const { data } = await apiClient.get(`/admin/interviews?${buildQuery(params)}`);
        return data;
    },
    analytics: async () => {
        const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>('/admin/analytics');
        return data.data;
    },
    activityLogs: async (params?: ListParams) => {
        const { data } = await apiClient.get(`/admin/activity-logs?${buildQuery(params)}`);
        return data;
    },
    settings: async () => {
        const { data } = await apiClient.get('/admin/settings');
        return data.data;
    },
    updateSettings: async (settings: Record<string, unknown>) => {
        await apiClient.put('/admin/settings', { settings });
    },
};
