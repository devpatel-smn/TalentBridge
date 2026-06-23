import { apiClient } from '@/lib/api-client';
import type { ApiResponse, ListParams } from '@/types/api';
import type { Company, Job, JobApplication, Interview } from '@/types/models';

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

export const employerApi = {
    dashboard: async () => {
        const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>('/employer/dashboard');
        return data.data;
    },
    company: {
        get: async () => {
            const { data } = await apiClient.get<ApiResponse<Company>>('/employer/company');
            return data.data;
        },
        update: async (payload: Partial<Company>) => {
            const { data } = await apiClient.put<ApiResponse<Company>>('/employer/company', payload);
            return data.data;
        },
    },
    verification: {
        get: async () => {
            const { data } = await apiClient.get('/employer/company/verification');
            return data.data;
        },
        submit: async (payload: Record<string, unknown>) => {
            await apiClient.post('/employer/company/verification', payload);
        },
    },
    jobs: {
        list: async (params?: ListParams) => {
            const { data } = await apiClient.get<ApiResponse<Job[]>>(`/employer/jobs?${buildQuery(params)}`);
            return data;
        },
        get: async (uuid: string) => {
            const { data } = await apiClient.get<ApiResponse<Job>>(`/employer/jobs/${uuid}`);
            return data.data;
        },
        create: async (payload: Partial<Job>) => {
            const { data } = await apiClient.post<ApiResponse<Job>>('/employer/jobs', payload);
            return data.data;
        },
        update: async (uuid: string, payload: Partial<Job>) => {
            const { data } = await apiClient.put<ApiResponse<Job>>(`/employer/jobs/${uuid}`, payload);
            return data.data;
        },
        publish: async (uuid: string) => {
            await apiClient.patch(`/employer/jobs/${uuid}/publish`);
        },
        close: async (uuid: string) => {
            await apiClient.patch(`/employer/jobs/${uuid}/close`);
        },
        delete: async (uuid: string) => {
            await apiClient.delete(`/employer/jobs/${uuid}`);
        },
    },
    applicants: {
        list: async (jobUuid: string, params?: ListParams) => {
            const { data } = await apiClient.get<ApiResponse<JobApplication[]>>(
                `/employer/jobs/${jobUuid}/applicants?${buildQuery(params)}`,
            );
            return data;
        },
        get: async (uuid: string) => {
            const { data } = await apiClient.get<ApiResponse<JobApplication>>(`/employer/applicants/${uuid}`);
            return data.data;
        },
        updateStatus: async (uuid: string, payload: { status: string; rejection_reason?: string }) => {
            await apiClient.patch(`/employer/applicants/${uuid}/status`, payload);
        },
    },
    interviews: {
        list: async (params?: ListParams) => {
            const { data } = await apiClient.get<ApiResponse<Interview[]>>(`/employer/interviews?${buildQuery(params)}`);
            return data;
        },
        create: async (payload: Record<string, unknown>) => {
            const { data } = await apiClient.post<ApiResponse<Interview>>('/employer/interviews', payload);
            return data.data;
        },
    },
};
