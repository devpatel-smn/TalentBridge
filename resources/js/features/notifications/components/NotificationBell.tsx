import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notificationsApi } from '@/features/notifications/api/notifications-api';
import { formatDateTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const { data: count = 0 } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: notificationsApi.unreadCount,
        enabled: isAuthenticated,
        refetchInterval: 60000,
    });

    const { data: notificationsData } = useQuery({
        queryKey: ['notifications', 'recent'],
        queryFn: () => notificationsApi.list({ per_page: 5 }),
        enabled: isAuthenticated,
    });

    const markRead = useMutation({
        mutationFn: notificationsApi.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    if (!isAuthenticated) return null;

    const notifications = notificationsData?.data ?? [];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {count > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {count > 9 ? '9+' : count}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-72">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className="flex flex-col items-start gap-1 p-3"
                                onClick={() => !n.read_at && markRead.mutate(n.id)}
                            >
                                <span className={`text-sm font-medium ${!n.read_at ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {n.data.title}
                                </span>
                                <span className="text-xs text-muted-foreground line-clamp-2">{n.data.body}</span>
                                <span className="text-xs text-muted-foreground">{formatDateTime(n.created_at)}</span>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/notifications" className="w-full justify-center text-center text-primary">
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
