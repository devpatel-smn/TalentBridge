import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';
import type { Company } from '@/types/models';

export const publicApi = {
    async getCompany(slug: string) {
        const { data } = await apiClient.get<ApiResponse<Company>>(`/companies/${slug}`);
        return data.data;
    },
};
