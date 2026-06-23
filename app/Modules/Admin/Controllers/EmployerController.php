<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\EmployerUser;
use App\Models\User;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Resources\EmployerResource;
use App\Modules\Admin\Services\EmployerManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;

class EmployerController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly EmployerManagementService $employerService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->employerService->list($params);

        return $this->paginated(
            EmployerResource::collection($paginator->items()),
            $paginator,
            'Employers retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(EmployerUser $employer): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        return $this->success(
            new EmployerResource($this->employerService->find($employer->id)),
            'Employer retrieved successfully.'
        );
    }
}
