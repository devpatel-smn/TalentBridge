<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\ActivityLog;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Resources\ActivityLogResource;
use App\Modules\Admin\Services\LogManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly LogManagementService $logService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', ActivityLog::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->logService->listActivityLogs($params);

        return $this->paginated(
            ActivityLogResource::collection($paginator->items()),
            $paginator,
            'Activity logs retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(int $id): JsonResponse
    {
        $log = $this->logService->findActivityLog($id);
        $this->authorize('view', $log);

        return $this->success(
            new ActivityLogResource($log),
            'Activity log retrieved successfully.'
        );
    }
}
