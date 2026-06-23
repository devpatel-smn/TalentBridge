<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\User;
use App\Modules\Admin\Services\AdminDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly AdminDashboardService $dashboardService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        return $this->success(
            $this->dashboardService->getDashboard(),
            'Dashboard metrics retrieved successfully.'
        );
    }
}
