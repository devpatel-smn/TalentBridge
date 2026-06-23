<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\AuditLog;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Resources\AuditLogResource;
use App\Modules\Admin\Services\LogManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly LogManagementService $logService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->logService->listAuditLogs($params);

        return $this->paginated(
            AuditLogResource::collection($paginator->items()),
            $paginator,
            'Audit logs retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(int $id): JsonResponse
    {
        $log = $this->logService->findAuditLog($id);
        $this->authorize('view', $log);

        return $this->success(
            new AuditLogResource($log),
            'Audit log retrieved successfully.'
        );
    }
}
