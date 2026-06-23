<?php

namespace App\Modules\Employer\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Employer\Requests\UpdateCompanySettingsRequest;
use App\Modules\Employer\Resources\CompanySettingsResource;
use App\Modules\Employer\Services\CompanySettingsService;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanySettingsController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly CompanySettingsService $settingsService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $this->authorize('update', $this->company($request));

        return $this->success(
            new CompanySettingsResource(
                $this->settingsService->getSettings($this->companyId($request))
            ),
            'Company settings retrieved successfully.'
        );
    }

    public function update(UpdateCompanySettingsRequest $request): JsonResponse
    {
        $company = $this->company($request);
        $this->authorize('update', $company);

        $settings = $this->settingsService->updateSettings(
            $company,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new CompanySettingsResource($settings),
            'Company settings updated successfully.'
        );
    }
}
