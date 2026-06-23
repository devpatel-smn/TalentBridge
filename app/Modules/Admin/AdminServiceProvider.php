<?php

namespace App\Modules\Admin;

use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\JobSeekerProfile;
use App\Models\SystemSetting;
use App\Modules\Admin\Repositories\AdminActivityLogRepository;
use App\Modules\Admin\Repositories\AdminAnalyticsRepository;
use App\Modules\Admin\Repositories\AdminAuditLogRepository;
use App\Modules\Admin\Repositories\AdminCompanyRepository;
use App\Modules\Admin\Repositories\AdminDashboardRepository;
use App\Modules\Admin\Repositories\AdminEmployerRepository;
use App\Modules\Admin\Repositories\AdminInterviewRepository;
use App\Modules\Admin\Repositories\AdminJobRepository;
use App\Modules\Admin\Repositories\AdminJobSeekerRepository;
use App\Modules\Admin\Repositories\AdminSystemSettingRepository;
use App\Modules\Admin\Repositories\AdminUserRepository;
use App\Modules\Admin\Repositories\AdminVerificationRepository;
use App\Modules\Admin\Repositories\Contracts\AdminActivityLogRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminAnalyticsRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminAuditLogRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminCompanyRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminDashboardRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminEmployerRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminInterviewRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminJobRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminJobSeekerRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminSystemSettingRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminUserRepositoryInterface;
use App\Modules\Admin\Repositories\Contracts\AdminVerificationRepositoryInterface;
use App\Policies\ActivityLogPolicy;
use App\Policies\AuditLogPolicy;
use App\Policies\JobSeekerProfilePolicy;
use App\Policies\SystemSettingPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AdminServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AdminDashboardRepositoryInterface::class, AdminDashboardRepository::class);
        $this->app->bind(AdminUserRepositoryInterface::class, AdminUserRepository::class);
        $this->app->bind(AdminEmployerRepositoryInterface::class, AdminEmployerRepository::class);
        $this->app->bind(AdminJobSeekerRepositoryInterface::class, AdminJobSeekerRepository::class);
        $this->app->bind(AdminCompanyRepositoryInterface::class, AdminCompanyRepository::class);
        $this->app->bind(AdminJobRepositoryInterface::class, AdminJobRepository::class);
        $this->app->bind(AdminInterviewRepositoryInterface::class, AdminInterviewRepository::class);
        $this->app->bind(AdminActivityLogRepositoryInterface::class, AdminActivityLogRepository::class);
        $this->app->bind(AdminAuditLogRepositoryInterface::class, AdminAuditLogRepository::class);
        $this->app->bind(AdminAnalyticsRepositoryInterface::class, AdminAnalyticsRepository::class);
        $this->app->bind(AdminVerificationRepositoryInterface::class, AdminVerificationRepository::class);
        $this->app->bind(AdminSystemSettingRepositoryInterface::class, AdminSystemSettingRepository::class);
    }

    public function boot(): void
    {
        $this->registerPolicies();
    }

    private function registerPolicies(): void
    {
        Gate::policy(ActivityLog::class, ActivityLogPolicy::class);
        Gate::policy(AuditLog::class, AuditLogPolicy::class);
        Gate::policy(SystemSetting::class, SystemSettingPolicy::class);
        Gate::policy(JobSeekerProfile::class, JobSeekerProfilePolicy::class);
    }
}
