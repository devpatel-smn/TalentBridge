<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\JobSeeker\Services\JobSeekerDashboardService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly JobSeekerDashboardService $dashboardService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $profile = $this->profile($request);
        $this->authorize('view', $profile);

        return $this->success(
            $this->dashboardService->getDashboard($profile->id, $request->user()->id),
            'Dashboard metrics retrieved successfully.'
        );
    }
}
