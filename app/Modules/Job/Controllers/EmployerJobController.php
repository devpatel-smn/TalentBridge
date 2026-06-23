<?php

namespace App\Modules\Job\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Job;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use App\Modules\Job\Requests\ListEmployerJobsRequest;
use App\Modules\Job\Requests\StoreJobRequest;
use App\Modules\Job\Requests\UpdateJobRequest;
use App\Modules\Job\Resources\JobAnalyticsResource;
use App\Modules\Job\Resources\JobDetailResource;
use App\Modules\Job\Resources\JobResource;
use App\Modules\Job\Services\JobAnalyticsService;
use App\Modules\Job\Services\JobPublishService;
use App\Modules\Job\Services\JobService;
use App\Modules\Job\Support\JobListQueryParams;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployerJobController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly JobService $jobService,
        private readonly JobPublishService $publishService,
        private readonly JobAnalyticsService $analyticsService,
    ) {}

    public function index(ListEmployerJobsRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Job::class);

        $params = JobListQueryParams::fromArray($request->validated());
        $paginator = $this->jobService->listForCompany($this->companyId($request), $params);

        return $this->paginated(
            JobResource::collection($paginator->items()),
            $paginator,
            'Jobs retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(StoreJobRequest $request): JsonResponse
    {
        $job = $this->jobService->create(
            $this->companyId($request),
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new JobDetailResource($job),
            'Job created successfully.'
        );
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('view', $job);

        return $this->success(
            new JobDetailResource($job),
            'Job retrieved successfully.'
        );
    }

    public function update(UpdateJobRequest $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('update', $job);

        $updated = $this->jobService->update(
            $job,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new JobDetailResource($updated),
            'Job updated successfully.'
        );
    }

    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('delete', $job);

        $this->jobService->delete($job, $request->user(), $request);

        return $this->success(message: 'Job deleted successfully.');
    }

    public function publish(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('publish', $job);

        $published = $this->publishService->publish($job, $request->user(), $request);

        return $this->success(
            new JobDetailResource($published),
            'Job published successfully.'
        );
    }

    public function close(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('close', $job);

        $closed = $this->publishService->close($job, $request->user(), $request);

        return $this->success(
            new JobDetailResource($closed),
            'Job closed successfully.'
        );
    }

    public function archive(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('archive', $job);

        $archived = $this->publishService->archive($job, $request->user(), $request);

        return $this->success(
            new JobDetailResource($archived),
            'Job archived successfully.'
        );
    }

    public function analytics(Request $request, string $uuid): JsonResponse
    {
        $job = $this->jobService->findForCompany($uuid, $this->companyId($request));
        $this->authorize('viewAnalytics', $job);

        $analytics = $this->analyticsService->forJob($job);

        return $this->success(
            new JobAnalyticsResource($analytics),
            'Job analytics retrieved successfully.'
        );
    }
}
