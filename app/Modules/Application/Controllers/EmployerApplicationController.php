<?php

namespace App\Modules\Application\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\JobApplication;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Application\Requests\ListApplicationsRequest;
use App\Modules\Application\Requests\UpdateApplicationStatusRequest;
use App\Modules\Application\Requests\UpdateCandidateNotesRequest;
use App\Modules\Application\Resources\ApplicationAnalyticsResource;
use App\Modules\Application\Resources\JobApplicationResource;
use App\Modules\Application\Services\ApplicationService;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployerApplicationController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly ApplicationService $applicationService,
    ) {}

    public function index(ListApplicationsRequest $request, string $uuid): JsonResponse
    {
        $this->authorize('viewAny', JobApplication::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->applicationService->listForCompany($this->companyId($request), $params, $uuid);

        return $this->paginated(
            JobApplicationResource::collection($paginator->items()),
            $paginator,
            'Applications retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        $application = $this->applicationService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('view', $application);

        return $this->success(
            new JobApplicationResource($application),
            'Application retrieved successfully.'
        );
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, string $uuid): JsonResponse
    {
        $application = $this->applicationService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('manage', $application);

        $updated = $this->applicationService->updateStatus(
            $application,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new JobApplicationResource($updated),
            'Application status updated successfully.'
        );
    }

    public function updateNotes(UpdateCandidateNotesRequest $request, string $uuid): JsonResponse
    {
        $application = $this->applicationService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('manage', $application);

        $updated = $this->applicationService->updateEmployerNotes(
            $application,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new JobApplicationResource($updated),
            'Candidate notes updated successfully.'
        );
    }

    public function analytics(Request $request, string $uuid): JsonResponse
    {
        $this->authorize('viewAny', JobApplication::class);

        $analytics = $this->applicationService->analyticsForJob($this->companyId($request), $uuid);

        return $this->success(
            new ApplicationAnalyticsResource($analytics),
            'Application analytics retrieved successfully.'
        );
    }
}
