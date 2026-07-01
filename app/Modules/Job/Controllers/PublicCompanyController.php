<?php

namespace App\Modules\Job\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Job\Requests\ListCompaniesRequest;
use App\Modules\Job\Resources\PublicCompanyResource;
use App\Modules\Job\Services\PublicCompanyService;
use Illuminate\Http\JsonResponse;

class PublicCompanyController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly PublicCompanyService $companyService,
    ) {}

    public function index(ListCompaniesRequest $request): JsonResponse
    {
        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->companyService->list($params);

        return $this->paginated(
            PublicCompanyResource::collection($paginator->items()),
            $paginator,
            'Companies retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function industries(): JsonResponse
    {
        return $this->success(
            $this->companyService->industries()->values(),
            'Company industries retrieved successfully.'
        );
    }

    public function show(string $slug): JsonResponse
    {
        $company = $this->companyService->findBySlug($slug);

        return $this->success(
            new PublicCompanyResource($company),
            'Company retrieved successfully.'
        );
    }
}
