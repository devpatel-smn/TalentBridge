<?php

namespace App\Modules\Job\Controllers;

use App\Enums\JobStatus;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Job\Requests\ListJobsRequest;
use App\Modules\Job\Resources\JobDetailResource;
use App\Modules\Job\Resources\JobResource;
use App\Modules\Job\Services\JobSearchService;
use App\Modules\Job\Services\JobService;
use App\Modules\Job\Support\JobListQueryParams;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicJobController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly JobSearchService $searchService,
        private readonly JobService $jobService,
    ) {}

    public function index(ListJobsRequest $request): JsonResponse
    {
        $params = JobListQueryParams::fromArray($request->validated());
        $paginator = $this->searchService->searchPublic($params);

        return $this->paginated(
            JobResource::collection($paginator->items()),
            $paginator,
            'Jobs retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function featured(Request $request): JsonResponse
    {
        $limit = min(20, max(1, (int) $request->query('limit', 10)));
        $jobs = $this->searchService->featured($limit);

        return $this->success(
            JobResource::collection($jobs),
            'Featured jobs retrieved successfully.'
        );
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->find($uuid);
        $this->authorize('view', $job);

        if ($job->status === JobStatus::Published) {
            $this->jobService->recordView($job);
        }

        return $this->success(
            new JobDetailResource($job),
            'Job retrieved successfully.'
        );
    }
}
