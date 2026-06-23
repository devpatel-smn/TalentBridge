<?php

namespace App\Modules\Employer\Services;

use App\Enums\AuditAction;
use App\Enums\VerificationStatus;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\CompanyVerification;
use App\Models\User;
use App\Modules\Employer\Repositories\Contracts\EmployerVerificationRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CompanyVerificationService
{
    public function __construct(
        private readonly EmployerVerificationRepositoryInterface $verifications,
    ) {}

    public function getLatest(int $companyId): ?CompanyVerification
    {
        return $this->verifications->findLatestByCompanyId($companyId);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function submit(Company $company, array $data, User $submitter, Request $request): CompanyVerification
    {
        if ($this->verifications->hasPendingVerification($company->id)) {
            throw ValidationException::withMessages([
                'verification' => ['A verification request is already pending review.'],
            ]);
        }

        if ($company->verification_status === VerificationStatus::Approved) {
            throw ValidationException::withMessages([
                'verification' => ['This company is already verified.'],
            ]);
        }

        return DB::transaction(function () use ($company, $data, $submitter, $request) {
            $verification = $this->verifications->create([
                'company_id' => $company->id,
                'submitted_by' => $submitter->id,
                'status' => VerificationStatus::Pending,
                'business_registration_number' => $data['business_registration_number'] ?? null,
                'tax_id' => $data['tax_id'] ?? null,
                'documents' => $data['documents'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $company->update([
                'verification_status' => VerificationStatus::Pending,
                'updated_by' => $submitter->id,
            ]);

            AuditLog::query()->create([
                'user_id' => $submitter->id,
                'action' => AuditAction::Created,
                'auditable_type' => CompanyVerification::class,
                'auditable_id' => $verification->id,
                'new_values' => [
                    'company_id' => $company->id,
                    'status' => VerificationStatus::Pending->value,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $verification;
        });
    }
}
