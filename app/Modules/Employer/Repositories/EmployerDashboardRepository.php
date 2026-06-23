<?php

namespace App\Modules\Employer\Repositories;

use App\Enums\ApplicationStatus;
use App\Enums\InterviewStatus;
use App\Enums\JobStatus;
use App\Enums\VerificationStatus;
use App\Models\Company;
use App\Models\CompanyVerification;
use App\Models\EmployerUser;
use App\Models\Interview;
use App\Models\Job;
use App\Models\JobApplication;
use App\Modules\Employer\Repositories\Contracts\EmployerDashboardRepositoryInterface;

class EmployerDashboardRepository implements EmployerDashboardRepositoryInterface
{
    public function getMetrics(int $companyId): array
    {
        $company = Company::query()->find($companyId);

        $jobsQuery = Job::query()
            ->where('company_id', $companyId)
            ->whereNull('deleted_at');

        $applicationsQuery = JobApplication::query()
            ->whereHas('job', fn ($query) => $query
                ->where('company_id', $companyId)
                ->whereNull('deleted_at'))
            ->whereNull('deleted_at');

        return [
            'company' => [
                'uuid' => $company?->uuid,
                'name' => $company?->name,
                'verification_status' => $company?->verification_status?->value,
                'verified_at' => $company?->verified_at?->toIso8601String(),
            ],
            'team' => [
                'active_members' => EmployerUser::query()
                    ->where('company_id', $companyId)
                    ->where('is_active', true)
                    ->whereNull('deleted_at')
                    ->count(),
            ],
            'jobs' => [
                'total' => (clone $jobsQuery)->count(),
                'published' => (clone $jobsQuery)->where('status', JobStatus::Published)->count(),
                'draft' => (clone $jobsQuery)->where('status', JobStatus::Draft)->count(),
                'closed' => (clone $jobsQuery)->where('status', JobStatus::Closed)->count(),
            ],
            'applications' => [
                'total' => (clone $applicationsQuery)->count(),
                'today' => (clone $applicationsQuery)
                    ->whereDate('applied_at', today())
                    ->count(),
                'pending_review' => (clone $applicationsQuery)
                    ->whereIn('status', [
                        ApplicationStatus::Submitted,
                        ApplicationStatus::UnderReview,
                    ])
                    ->count(),
            ],
            'interviews' => [
                'upcoming' => Interview::query()
                    ->where('company_id', $companyId)
                    ->whereNull('deleted_at')
                    ->where('scheduled_at', '>=', now())
                    ->whereIn('status', [
                        InterviewStatus::Scheduled,
                        InterviewStatus::Confirmed,
                    ])
                    ->count(),
            ],
            'verification' => [
                'latest_status' => CompanyVerification::query()
                    ->where('company_id', $companyId)
                    ->latest('id')
                    ->value('status')?->value,
                'pending_review' => CompanyVerification::query()
                    ->where('company_id', $companyId)
                    ->whereIn('status', [
                        VerificationStatus::Pending,
                        VerificationStatus::UnderReview,
                    ])
                    ->exists(),
            ],
        ];
    }
}
