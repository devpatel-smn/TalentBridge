<?php

namespace App\Modules\Admin\Repositories;

use App\Enums\JobStatus;
use App\Enums\VerificationStatus;
use App\Models\Company;
use App\Models\CompanyVerification;
use App\Models\Interview;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Role;
use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminDashboardRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AdminDashboardRepository implements AdminDashboardRepositoryInterface
{
    public function getMetrics(): array
    {
        $usersByRole = User::query()
            ->select('roles.name as role', DB::raw('count(*) as total'))
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->where('model_has_roles.model_type', User::class)
            ->whereNull('users.deleted_at')
            ->groupBy('roles.name')
            ->pluck('total', 'role');

        $topIndustries = Company::query()
            ->select('industry', DB::raw('count(*) as total'))
            ->whereNotNull('industry')
            ->whereNull('deleted_at')
            ->groupBy('industry')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'industry' => $row->industry,
                'total' => (int) $row->total,
            ]);

        $applicationFunnel = JobApplication::query()
            ->select('status', DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->status->value => (int) $row->total]);

        return [
            'users' => [
                'total' => User::query()->whereNull('deleted_at')->count(),
                'by_role' => [
                    Role::ADMIN => (int) ($usersByRole[Role::ADMIN] ?? 0),
                    Role::EMPLOYER => (int) ($usersByRole[Role::EMPLOYER] ?? 0),
                    Role::JOB_SEEKER => (int) ($usersByRole[Role::JOB_SEEKER] ?? 0),
                ],
                'new_last_7_days' => User::query()
                    ->whereNull('deleted_at')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->count(),
            ],
            'jobs' => [
                'total' => Job::query()->whereNull('deleted_at')->count(),
                'active_published' => Job::query()
                    ->whereNull('deleted_at')
                    ->where('status', JobStatus::Published)
                    ->count(),
            ],
            'verifications' => [
                'pending' => CompanyVerification::query()
                    ->whereIn('status', [
                        VerificationStatus::Pending,
                        VerificationStatus::UnderReview,
                    ])
                    ->count(),
            ],
            'applications' => [
                'today' => JobApplication::query()
                    ->whereNull('deleted_at')
                    ->whereDate('applied_at', today())
                    ->count(),
                'funnel' => $applicationFunnel,
            ],
            'interviews' => [
                'this_week' => Interview::query()
                    ->whereNull('deleted_at')
                    ->whereBetween('scheduled_at', [now()->startOfWeek(), now()->endOfWeek()])
                    ->count(),
            ],
            'top_industries' => $topIndustries,
        ];
    }
}
