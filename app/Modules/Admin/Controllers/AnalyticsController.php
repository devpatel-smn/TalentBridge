<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Admin\Services\AnalyticsService;
use App\Support\Permissions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly AnalyticsService $analyticsService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        abort_unless($request->user()?->can(Permissions::ANALYTICS_ADMIN), 403);

        return $this->success(
            $this->analyticsService->getPlatformAnalytics(),
            'Platform analytics retrieved successfully.'
        );
    }
}
