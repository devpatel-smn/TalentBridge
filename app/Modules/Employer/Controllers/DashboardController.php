<?php

namespace App\Modules\Employer\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Employer\Services\EmployerDashboardService;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly EmployerDashboardService $dashboardService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $this->authorize('view', $this->company($request));

        return $this->success(
            $this->dashboardService->getDashboard($this->companyId($request)),
            'Dashboard metrics retrieved successfully.'
        );
    }
}
