import { apiClient } from '@/lib/api-client';
import type { ApiResponse, ListParams } from '@/types/api';
import type { Notification, NotificationPreference } from '@/types/models';

function buildParams(params?: ListParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));
    return searchParams.toString();
}

export const notificationsApi = {
    async list(params?: ListParams) {
        const { data } = await apiClient.get<ApiResponse<Notification[]>>(`/notifications?${buildParams(params)}`);
        return data;
    },

    async unreadCount() {
        const { data } = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
        return data.data.count;
    },

    async markAsRead(id: string) {
        await apiClient.patch(`/notifications/${id}/read`);
    },

    async markAllAsRead() {
        await apiClient.post('/notifications/read-all');
    },

    async getPreferences() {
        const { data } = await apiClient.get<ApiResponse<NotificationPreference[]>>('/notification-preferences');
        return data.data;
    },

    async updatePreferences(preferences: NotificationPreference[]) {
        await apiClient.put('/notification-preferences', { preferences });
    },
};
