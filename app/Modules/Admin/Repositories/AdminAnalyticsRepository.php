<?php

namespace App\Modules\Admin\Repositories;

use App\Enums\JobStatus;
use App\Enums\VerificationStatus;
use App\Models\Company;
use App\Models\CompanyVerification;
use App\Models\Interview;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminAnalyticsRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsRepository implements AdminAnalyticsRepositoryInterface
{
    public function getPlatformAnalytics(): array
    {
        $userGrowth = User::query()
            ->select(DB::raw("date_trunc('month', created_at) as period"), DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(fn ($row) => [
                'period' => $row->period,
                'total' => (int) $row->total,
            ]);

        $jobPostingTrends = Job::query()
            ->select(DB::raw("date_trunc('month', created_at) as period"), DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(fn ($row) => [
                'period' => $row->period,
                'total' => (int) $row->total,
            ]);

        $jobsByStatus = Job::query()
            ->select('status', DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->status->value => (int) $row->total]);

        $applicationFunnel = JobApplication::query()
            ->select('status', DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->status->value => (int) $row->total]);

        $verificationStats = CompanyVerification::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->status->value => (int) $row->total]);

        $interviewsByStatus = Interview::query()
            ->select('status', DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->status->value => (int) $row->total]);

        $topCompaniesByJobs = Company::query()
            ->withCount(['jobs' => fn ($q) => $q->whereNull('deleted_at')])
            ->whereNull('deleted_at')
            ->orderByDesc('jobs_count')
            ->limit(10)
            ->get()
            ->map(fn (Company $company) => [
                'uuid' => $company->uuid,
                'name' => $company->name,
                'jobs_count' => $company->jobs_count,
            ]);

        return [
            'user_growth' => $userGrowth,
            'job_posting_trends' => $jobPostingTrends,
            'jobs_by_status' => $jobsByStatus,
            'application_funnel' => $applicationFunnel,
            'verification_stats' => $verificationStats,
            'interviews_by_status' => $interviewsByStatus,
            'published_jobs' => Job::query()
                ->whereNull('deleted_at')
                ->where('status', JobStatus::Published)
                ->count(),
            'pending_verifications' => CompanyVerification::query()
                ->whereIn('status', [VerificationStatus::Pending, VerificationStatus::UnderReview])
                ->count(),
            'top_companies_by_jobs' => $topCompaniesByJobs,
        ];
    }
}
