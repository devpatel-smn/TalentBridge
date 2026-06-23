<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\NotificationPreference;
use App\Modules\Notification\Requests\UpdateNotificationPreferencesRequest;
use App\Modules\Notification\Resources\NotificationPreferenceResource;
use App\Modules\Notification\Services\NotificationPreferenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly NotificationPreferenceService $preferenceService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', NotificationPreference::class);

        $preferences = $this->preferenceService->listWithDefaults($request->user());

        return $this->success(
            NotificationPreferenceResource::collection($preferences),
            'Notification preferences retrieved successfully.',
        );
    }

    public function update(UpdateNotificationPreferencesRequest $request): JsonResponse
    {
        $this->authorize('update', NotificationPreference::class);

        $this->preferenceService->update(
            $request->user(),
            $request->validated('preferences'),
        );

        $preferences = $this->preferenceService->listWithDefaults($request->user());

        return $this->success(
            NotificationPreferenceResource::collection($preferences),
            'Notification preferences updated successfully.',
        );
    }
}
