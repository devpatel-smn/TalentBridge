<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\JobSeekerProfile;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Resources\JobSeekerResource;
use App\Modules\Admin\Services\JobSeekerManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;

class JobSeekerController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly JobSeekerManagementService $jobSeekerService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', JobSeekerProfile::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->jobSeekerService->list($params);

        return $this->paginated(
            JobSeekerResource::collection($paginator->items()),
            $paginator,
            'Job seekers retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $profile = $this->jobSeekerService->find($uuid);
        $this->authorize('view', $profile);

        return $this->success(
            new JobSeekerResource($profile),
            'Job seeker retrieved successfully.'
        );
    }
}
