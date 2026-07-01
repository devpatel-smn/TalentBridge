import { apiClient } from '@/lib/api-client';
import type { ApiResponse, ListParams } from '@/types/api';
import type { Company } from '@/types/models';

function buildQuery(params?: ListParams) {
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

export const publicApi = {
    async listCompanies(params?: ListParams) {
        const { data } = await apiClient.get<ApiResponse<Company[]>>(`/companies?${buildQuery(params)}`);
        return data;
    },

    async getCompanyIndustries() {
        const { data } = await apiClient.get<ApiResponse<string[]>>('/companies/industries');
        return data.data;
    },

    async getCompany(slug: string) {
        const { data } = await apiClient.get<ApiResponse<Company>>(`/companies/${slug}`);
        return data.data;
    },
};
