<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Role;
use App\Models\User;
use App\Modules\Notification\Notifications\SystemNotification;
use App\Modules\Notification\Requests\SendSystemNotificationRequest;
use App\Modules\Notification\Services\NotificationDispatchService;
use App\Modules\Notification\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class AdminNotificationController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly NotificationDispatchService $dispatchService,
        private readonly NotificationService $notificationService,
    ) {}

    public function send(SendSystemNotificationRequest $request): JsonResponse
    {
        $notification = SystemNotification::create(
            $request->validated('title'),
            $request->validated('body'),
            $request->validated('action_url'),
        );

        $targetRole = $request->validated('target_role');
        $actor = $request->user();

        $users = $this->resolveRecipients($targetRole);
        $recipientCount = $this->notificationService->dispatchSystemNotification(
            $users,
            $notification,
            $actor,
            $request,
        );

        return $this->success(
            ['recipient_count' => $recipientCount],
            'System notification queued successfully.',
        );
    }

    /**
     * @return Collection<int, User>
     */
    private function resolveRecipients(string $targetRole): Collection
    {
        if ($targetRole === 'all') {
            return User::query()->active()->get();
        }

        return $this->dispatchService->usersForRole($targetRole);
    }
}
