<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Job;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Requests\UpdateJobRequest;
use App\Modules\Admin\Resources\JobResource;
use App\Modules\Admin\Services\JobManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly JobManagementService $jobService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Job::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->jobService->list($params);

        return $this->paginated(
            JobResource::collection($paginator->items()),
            $paginator,
            'Jobs retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $job = $this->jobService->find($uuid);
        $this->authorize('view', $job);

        return $this->success(
            new JobResource($job),
            'Job retrieved successfully.'
        );
    }

    public function update(UpdateJobRequest $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->find($uuid);
        $this->authorize('update', $job);

        $updated = $this->jobService->update(
            $job,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new JobResource($updated),
            'Job updated successfully.'
        );
    }

    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->find($uuid);
        $this->authorize('delete', $job);

        $this->jobService->delete($job, $request->user(), $request);

        return $this->success(message: 'Job deleted successfully.');
    }
}
