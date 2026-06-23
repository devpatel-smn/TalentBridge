<?php

namespace App\Modules\Employer\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\CompanyVerification;
use App\Modules\Employer\Requests\SubmitVerificationRequest;
use App\Modules\Employer\Resources\EmployerVerificationResource;
use App\Modules\Employer\Services\CompanyVerificationService;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyVerificationController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly CompanyVerificationService $verificationService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CompanyVerification::class);

        $verification = $this->verificationService->getLatest($this->companyId($request));

        return $this->success(
            $verification ? new EmployerVerificationResource($verification) : null,
            $verification
                ? 'Verification status retrieved successfully.'
                : 'No verification request has been submitted yet.'
        );
    }

    public function store(SubmitVerificationRequest $request): JsonResponse
    {
        $this->authorize('create', CompanyVerification::class);

        $verification = $this->verificationService->submit(
            $this->company($request),
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new EmployerVerificationResource($verification),
            'Verification request submitted successfully.'
        );
    }
}
