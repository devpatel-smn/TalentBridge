<?php

namespace App\Modules\Employer\Repositories;

use App\Enums\VerificationStatus;
use App\Models\CompanyVerification;
use App\Modules\Employer\Repositories\Contracts\EmployerVerificationRepositoryInterface;

class EmployerVerificationRepository implements EmployerVerificationRepositoryInterface
{
    public function findLatestByCompanyId(int $companyId): ?CompanyVerification
    {
        return CompanyVerification::query()
            ->with(['submitter', 'reviewer'])
            ->where('company_id', $companyId)
            ->latest('id')
            ->first();
    }

    public function hasPendingVerification(int $companyId): bool
    {
        return CompanyVerification::query()
            ->where('company_id', $companyId)
            ->whereIn('status', [
                VerificationStatus::Pending,
                VerificationStatus::UnderReview,
            ])
            ->exists();
    }

    public function create(array $attributes): CompanyVerification
    {
        return CompanyVerification::query()
            ->create($attributes)
            ->load(['submitter', 'reviewer']);
    }
}
