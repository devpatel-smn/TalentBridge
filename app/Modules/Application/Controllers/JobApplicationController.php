<?php

namespace App\Modules\Application\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\JobApplication;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Application\Requests\ApplyToJobRequest;
use App\Modules\Application\Requests\ListApplicationsRequest;
use App\Modules\Application\Resources\JobApplicationResource;
use App\Modules\Application\Services\ApplicationService;
use App\Modules\Job\Services\JobService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly ApplicationService $applicationService,
        private readonly JobService $jobService,
    ) {}

    public function index(ListApplicationsRequest $request): JsonResponse
    {
        $this->authorize('viewAny', JobApplication::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->applicationService->listForJobSeeker($this->profileId($request), $params);

        return $this->paginated(
            JobApplicationResource::collection($paginator->items()),
            $paginator,
            'Applications retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order', 'include'])
        );
    }

    public function store(ApplyToJobRequest $request, string $uuid): JsonResponse
    {
        $this->authorize('create', JobApplication::class);

        $job = $this->jobService->findPublic($uuid);
        $this->authorize('view', $job);

        $application = $this->applicationService->apply(
            $this->profile($request),
            $job,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new JobApplicationResource($application),
            'Application submitted successfully.'
        );
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        $application = $this->applicationService->findForJobSeeker($uuid, $this->profileId($request));
        $this->authorize('view', $application);

        return $this->success(
            new JobApplicationResource($application),
            'Application retrieved successfully.'
        );
    }

    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $application = $this->applicationService->findForJobSeeker($uuid, $this->profileId($request));
        $this->authorize('delete', $application);

        $withdrawn = $this->applicationService->withdraw($application, $request->user(), $request);

        return $this->success(
            new JobApplicationResource($withdrawn),
            'Application withdrawn successfully.'
        );
    }
}
