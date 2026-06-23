import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { notificationsApi } from '@/features/notifications/api/notifications-api';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { cn, formatDateTime } from '@/lib/utils';
import type { Notification } from '@/types/models';

function NotificationItem({
    notification,
    onMarkRead,
    isMarking,
}: {
    notification: Notification;
    onMarkRead: (id: string) => void;
    isMarking: boolean;
}) {
    const isUnread = !notification.read_at;

    return (
        <Card
            className={cn(
                'transition-all hover:shadow-sm',
                isUnread && 'border-primary/30 bg-primary/5',
            )}
        >
            <CardContent className="flex gap-4 p-4">
                <div
                    className={cn(
                        'mt-1 h-2 w-2 shrink-0 rounded-full',
                        isUnread ? 'bg-primary' : 'bg-transparent',
                    )}
                />
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className={cn('font-medium', isUnread ? 'text-foreground' : 'text-muted-foreground')}>
                            {notification.data.title}
                        </h3>
                        <span className="shrink-0 text-xs text-muted-foreground">
                            {formatDateTime(notification.created_at)}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.data.body}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {notification.data.action_url && (
                            <Button asChild variant="link" size="sm" className="h-auto p-0">
                                <Link to={notification.data.action_url}>View details</Link>
                            </Button>
                        )}
                        {isUnread && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-primary"
                                disabled={isMarking}
                                onClick={() => onMarkRead(notification.id)}
                            >
                                Mark as read
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function NotificationsPage() {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['notifications', 'list', page],
        queryFn: () => notificationsApi.list({ page, per_page: DEFAULT_PAGE_SIZE }),
    });

    const markReadMutation = useMutation({
        mutationFn: notificationsApi.markAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const markAllMutation = useMutation({
        mutationFn: notificationsApi.markAllAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const notifications = data?.data ?? [];
    const meta = data?.meta?.pagination;
    const hasUnread = notifications.some((n) => !n.read_at);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6">
                <PageHeader
                    title="Notifications"
                    description="Stay updated on your applications, interviews, and account activity."
                    actions={
                        hasUnread ? (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={markAllMutation.isPending}
                                onClick={() => markAllMutation.mutate()}
                            >
                                <CheckCheck className="mr-2 h-4 w-4" />
                                Mark all read
                            </Button>
                        ) : undefined
                    }
                />

                <div className="mt-6">
                    {isLoading ? (
                        <LoadingSpinner label="Loading notifications..." />
                    ) : isError ? (
                        <ErrorState title="Unable to load notifications" onRetry={() => refetch()} />
                    ) : notifications.length === 0 ? (
                        <EmptyState
                            icon={<Bell className="h-6 w-6 text-muted-foreground" />}
                            title="No notifications"
                            description="You're all caught up. New updates will appear here."
                        />
                    ) : (
                        <>
                            <div className="space-y-3">
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkRead={(id) => markReadMutation.mutate(id)}
                                        isMarking={markReadMutation.isPending}
                                    />
                                ))}
                            </div>
                            {meta && <Pagination meta={meta} onPageChange={setPage} />}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
