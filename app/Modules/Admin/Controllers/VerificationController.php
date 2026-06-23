<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\CompanyVerification;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Requests\ReviewVerificationRequest;
use App\Modules\Admin\Resources\VerificationResource;
use App\Modules\Admin\Services\VerificationManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;

class VerificationController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly VerificationManagementService $verificationService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', CompanyVerification::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->verificationService->list($params);

        return $this->paginated(
            VerificationResource::collection($paginator->items()),
            $paginator,
            'Verification requests retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(int $verification): JsonResponse
    {
        $record = $this->verificationService->find($verification);
        $this->authorize('view', $record);

        return $this->success(
            new VerificationResource($record),
            'Verification request retrieved successfully.'
        );
    }

    public function review(ReviewVerificationRequest $request, int $verification): JsonResponse
    {
        $record = $this->verificationService->find($verification);

        $updated = $this->verificationService->review(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new VerificationResource($updated),
            'Verification reviewed successfully.'
        );
    }
}
