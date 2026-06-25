import { apiClient } from '@/lib/api-client';
import type { ApiResponse, ListParams } from '@/types/api';
import type { JobApplication, JobSeekerProfile, Resume, Interview, Job } from '@/types/models';

function buildQuery(params?: ListParams) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.per_page) sp.set('per_page', String(params.per_page));
    if (params?.search) sp.set('search', params.search);
    if (params?.filter) {
        Object.entries(params.filter).forEach(([k, v]) => {
            if (v !== undefined) sp.set(`filter[${k}]`, String(v));
        });
    }
    return sp.toString();
}

export const jobSeekerApi = {
    dashboard: async () => {
        const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>('/job-seeker/dashboard');
        return data.data;
    },
    profile: {
        get: async () => {
            const { data } = await apiClient.get<ApiResponse<JobSeekerProfile>>('/job-seeker/profile');
            return data.data;
        },
        update: async (payload: Partial<JobSeekerProfile>) => {
            const { data } = await apiClient.put<ApiResponse<JobSeekerProfile>>('/job-seeker/profile', payload);
            return data.data;
        },
        completion: async () => {
            const { data } = await apiClient.get<ApiResponse<{ completion: number }>>('/job-seeker/profile/completion');
            return data.data;
        },
    },
    applications: {
        list: async (params?: ListParams) => {
            const { data } = await apiClient.get<ApiResponse<JobApplication[]>>(
                `/job-seeker/applications?${buildQuery(params)}`,
            );
            return data;
        },
        get: async (uuid: string) => {
            const { data } = await apiClient.get<ApiResponse<JobApplication>>(`/job-seeker/applications/${uuid}`);
            return data.data;
        },
        withdraw: async (uuid: string) => {
            await apiClient.delete(`/job-seeker/applications/${uuid}`);
        },
        apply: async (jobUuid: string, payload: { resume_uuid?: string; cover_letter?: string }) => {
            await apiClient.post(`/jobs/${jobUuid}/apply`, payload);
        },
    },
    savedJobs: {
        list: async (params?: ListParams) => {
            const { data } = await apiClient.get<ApiResponse<Job[]>>(`/job-seeker/saved-jobs?${buildQuery(params)}`);
            return data;
        },
        save: async (job_uuid: string) => {
            await apiClient.post('/job-seeker/saved-jobs', { job_uuid });
        },
        remove: async (jobUuid: string) => {
            await apiClient.delete(`/job-seeker/saved-jobs/${jobUuid}`);
        },
    },
    resumes: {
        list: async () => {
            const { data } = await apiClient.get<ApiResponse<Resume[]>>('/job-seeker/resumes');
            return data.data;
        },
        get: async (uuid: string) => {
            const { data } = await apiClient.get<ApiResponse<Resume>>(`/job-seeker/resumes/${uuid}`);
            return data.data;
        },
        create: async (payload: { title: string; source: string; template_key?: string }) => {
            const { data } = await apiClient.post<ApiResponse<Resume>>('/job-seeker/resumes', payload);
            return data.data;
        },
        update: async (uuid: string, payload: Partial<Resume>) => {
            const { data } = await apiClient.put<ApiResponse<Resume>>(`/job-seeker/resumes/${uuid}`, payload);
            return data.data;
        },
        updateSections: async (uuid: string, sections: unknown[]) => {
            await apiClient.patch(`/job-seeker/resumes/${uuid}/sections`, { sections });
        },
        export: async (uuid: string) => {
            const { data } = await apiClient.post<ApiResponse<{ url: string }>>(`/job-seeker/resumes/${uuid}/export`);
            return data.data;
        },
        delete: async (uuid: string) => {
            await apiClient.delete(`/job-seeker/resumes/${uuid}`);
        },
    },
    interviews: {
        list: async (params?: ListParams) => {
            const { data } = await apiClient.get<ApiResponse<Interview[]>>(
                `/job-seeker/interviews?${buildQuery(params)}`,
            );
            return data;
        },
        upcoming: async (params?: ListParams) => {
            const { data } = await apiClient.get<ApiResponse<Interview[]>>(
                `/job-seeker/interviews/upcoming?${buildQuery(params)}`,
            );
            return data;
        },
        get: async (uuid: string) => {
            const { data } = await apiClient.get<ApiResponse<Interview>>(`/job-seeker/interviews/${uuid}`);
            return data.data;
        },
        respond: async (uuid: string, response: 'accepted' | 'declined') => {
            await apiClient.patch(`/job-seeker/interviews/${uuid}/respond`, { response });
        },
    },
};
