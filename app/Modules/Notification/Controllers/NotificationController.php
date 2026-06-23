<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\DatabaseNotification;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Notification\Requests\BulkNotificationActionRequest;
use App\Modules\Notification\Requests\ListNotificationsRequest;
use App\Modules\Notification\Resources\NotificationResource;
use App\Modules\Notification\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function index(ListNotificationsRequest $request): JsonResponse
    {
        $this->authorize('viewAny', DatabaseNotification::class);

        $user = $request->user();
        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->notificationService->list($user, $params);

        return $this->paginated(
            NotificationResource::collection($paginator->items()),
            $paginator,
            'Notifications retrieved successfully.',
            array_merge(
                $request->only(['filter', 'sort', 'order']),
                ['unread_count' => $this->notificationService->unreadCount($user)],
            ),
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $notification = $this->notificationService->find($request->user(), $id);
        $this->authorize('view', $notification);

        return $this->success(
            new NotificationResource($notification),
            'Notification retrieved successfully.',
        );
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $this->notificationService->find($request->user(), $id);
        $this->authorize('update', $notification);

        $updated = $this->notificationService->markAsRead($request->user(), $id, $request);

        return $this->success(
            new NotificationResource($updated),
            'Notification marked as read.',
        );
    }

    public function markAsUnread(Request $request, string $id): JsonResponse
    {
        $notification = $this->notificationService->find($request->user(), $id);
        $this->authorize('update', $notification);

        $updated = $this->notificationService->markAsUnread($request->user(), $id, $request);

        return $this->success(
            new NotificationResource($updated),
            'Notification marked as unread.',
        );
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->authorize('viewAny', DatabaseNotification::class);

        $count = $this->notificationService->markAllAsRead($request->user(), $request);

        return $this->success(
            ['updated_count' => $count],
            'All notifications marked as read.',
        );
    }

    public function bulkRead(BulkNotificationActionRequest $request): JsonResponse
    {
        $this->authorize('viewAny', DatabaseNotification::class);

        $ids = $request->validated('ids', []);
        $count = $ids === []
            ? $this->notificationService->markAllAsRead($request->user(), $request)
            : $this->notificationService->markManyAsRead($request->user(), $ids, $request);

        return $this->success(
            ['updated_count' => $count],
            'Notifications marked as read.',
        );
    }

    public function bulkUnread(BulkNotificationActionRequest $request): JsonResponse
    {
        $this->authorize('viewAny', DatabaseNotification::class);

        $count = $this->notificationService->markManyAsUnread(
            $request->user(),
            $request->validated('ids', []),
            $request,
        );

        return $this->success(
            ['updated_count' => $count],
            'Notifications marked as unread.',
        );
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $this->authorize('viewAny', DatabaseNotification::class);

        return $this->success(
            ['unread_count' => $this->notificationService->unreadCount($request->user())],
            'Unread notification count retrieved successfully.',
        );
    }
}
