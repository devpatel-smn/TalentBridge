<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Interview;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Resources\InterviewResource;
use App\Modules\Admin\Services\InterviewMonitoringService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;

class InterviewController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly InterviewMonitoringService $interviewService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Interview::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->interviewService->list($params);

        return $this->paginated(
            InterviewResource::collection($paginator->items()),
            $paginator,
            'Interviews retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $interview = $this->interviewService->find($uuid);
        $this->authorize('view', $interview);

        return $this->success(
            new InterviewResource($interview),
            'Interview retrieved successfully.'
        );
    }
}
