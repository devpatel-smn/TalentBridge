<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Company;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Requests\UpdateCompanyRequest;
use App\Modules\Admin\Resources\CompanyResource;
use App\Modules\Admin\Services\CompanyManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly CompanyManagementService $companyService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Company::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->companyService->list($params);

        return $this->paginated(
            CompanyResource::collection($paginator->items()),
            $paginator,
            'Companies retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $company = $this->companyService->find($uuid);
        $this->authorize('view', $company);

        return $this->success(
            new CompanyResource($company),
            'Company retrieved successfully.'
        );
    }

    public function update(UpdateCompanyRequest $request, string $uuid): JsonResponse
    {
        $company = $this->companyService->find($uuid);
        $this->authorize('update', $company);

        $updated = $this->companyService->update(
            $company,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new CompanyResource($updated),
            'Company updated successfully.'
        );
    }

    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $company = $this->companyService->find($uuid);
        $this->authorize('delete', $company);

        $this->companyService->delete($company, $request->user(), $request);

        return $this->success(message: 'Company deleted successfully.');
    }
}
