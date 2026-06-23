<?php

namespace App\Modules\Admin\Services;

use App\Enums\AuditAction;
use App\Enums\VerificationStatus;
use App\Models\AuditLog;
use App\Models\CompanyVerification;
use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminVerificationRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VerificationManagementService
{
    public function __construct(
        private readonly AdminVerificationRepositoryInterface $verifications,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->verifications->paginate($params);
    }

    public function find(int $id): CompanyVerification
    {
        return $this->verifications->findById($id)
            ?? throw ValidationException::withMessages(['id' => ['Verification request not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function review(CompanyVerification $verification, array $data, User $reviewer, Request $request): CompanyVerification
    {
        if (in_array($verification->status, [VerificationStatus::Approved, VerificationStatus::Rejected], true)) {
            throw ValidationException::withMessages([
                'status' => ['This verification has already been reviewed.'],
            ]);
        }

        $decision = VerificationStatus::from($data['status']);

        return DB::transaction(function () use ($verification, $data, $reviewer, $request, $decision) {
            $verification = $this->verifications->update($verification, [
                'status' => $decision,
                'reviewer_id' => $reviewer->id,
                'reviewer_notes' => $data['reviewer_notes'] ?? null,
                'rejection_reason' => $data['rejection_reason'] ?? null,
                'reviewed_at' => now(),
            ]);

            $company = $verification->company;
            $companyUpdates = [
                'verification_status' => $decision,
                'updated_by' => $reviewer->id,
            ];

            if ($decision === VerificationStatus::Approved) {
                $companyUpdates['verified_at'] = now();
                $companyUpdates['verified_by'] = $reviewer->id;
            }

            if ($decision === VerificationStatus::Rejected) {
                $companyUpdates['verified_at'] = null;
                $companyUpdates['verified_by'] = null;
            }

            $company->update($companyUpdates);

            AuditLog::query()->create([
                'user_id' => $reviewer->id,
                'action' => AuditAction::Updated,
                'auditable_type' => CompanyVerification::class,
                'auditable_id' => $verification->id,
                'new_values' => [
                    'status' => $decision->value,
                    'company_id' => $company->id,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $verification->load(['company', 'submitter', 'reviewer']);
        });
    }
}
