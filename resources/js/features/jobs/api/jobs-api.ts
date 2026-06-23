import { apiClient } from '@/lib/api-client';
import type { ApiResponse, ListParams } from '@/types/api';
import type { Job, JobCategory } from '@/types/models';

export interface JobListParams extends ListParams {
    filter?: Record<string, string | number | boolean | undefined>;
}

function buildQuery(params?: JobListParams) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.per_page) sp.set('per_page', String(params.per_page));
    if (params?.search) sp.set('search', params.search);
    if (params?.sort) sp.set('sort', params.sort);
    if (params?.order) sp.set('order', params.order);
    if (params?.filter) {
        Object.entries(params.filter).forEach(([k, v]) => {
            if (v !== undefined && v !== '') sp.set(`filter[${k}]`, String(v));
        });
    }
    return sp.toString();
}

export const jobsApi = {
    async list(params?: JobListParams) {
        const { data } = await apiClient.get<ApiResponse<Job[]>>(`/jobs?${buildQuery(params)}`);
        return data;
    },

    async get(uuid: string) {
        const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${uuid}`);
        return data.data;
    },

    async categories() {
        const { data } = await apiClient.get<ApiResponse<JobCategory[]>>('/job-categories');
        return data.data;
    },

    async searchSkills(q: string) {
        const { data } = await apiClient.get<ApiResponse<{ id: number; name: string }[]>>(`/skills?search=${encodeURIComponent(q)}`);
        return data.data;
    },
};
