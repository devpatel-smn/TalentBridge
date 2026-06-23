<?php

namespace App\Modules\Employer;

use App\Models\EmployerUser;
use App\Modules\Employer\Repositories\Contracts\EmployerCompanyRepositoryInterface;
use App\Modules\Employer\Repositories\Contracts\EmployerDashboardRepositoryInterface;
use App\Modules\Employer\Repositories\Contracts\EmployerTeamRepositoryInterface;
use App\Modules\Employer\Repositories\Contracts\EmployerVerificationRepositoryInterface;
use App\Modules\Employer\Repositories\EmployerCompanyRepository;
use App\Modules\Employer\Repositories\EmployerDashboardRepository;
use App\Modules\Employer\Repositories\EmployerTeamRepository;
use App\Modules\Employer\Repositories\EmployerVerificationRepository;
use App\Policies\EmployerUserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class EmployerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(EmployerCompanyRepositoryInterface::class, EmployerCompanyRepository::class);
        $this->app->bind(EmployerVerificationRepositoryInterface::class, EmployerVerificationRepository::class);
        $this->app->bind(EmployerDashboardRepositoryInterface::class, EmployerDashboardRepository::class);
        $this->app->bind(EmployerTeamRepositoryInterface::class, EmployerTeamRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(EmployerUser::class, EmployerUserPolicy::class);
    }
}
