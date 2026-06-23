<?php

namespace App\Modules\Employer\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Employer\Requests\UpdateCompanyProfileRequest;
use App\Modules\Employer\Resources\CompanyProfileResource;
use App\Modules\Employer\Services\CompanyService;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $company = $this->companyService->getProfile($this->companyId($request));
        $this->authorize('view', $company);

        return $this->success(
            new CompanyProfileResource($company),
            'Company profile retrieved successfully.'
        );
    }

    public function update(UpdateCompanyProfileRequest $request): JsonResponse
    {
        $company = $this->company($request);
        $this->authorize('update', $company);

        $updated = $this->companyService->updateProfile(
            $company,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new CompanyProfileResource($updated),
            'Company profile updated successfully.'
        );
    }
}
