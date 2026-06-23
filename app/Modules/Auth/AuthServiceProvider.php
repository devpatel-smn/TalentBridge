<?php

namespace App\Modules\Auth;

use App\Models\Company;
use App\Models\CompanyVerification;
use App\Models\File;
use App\Models\Interview;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Resume;
use App\Models\User;
use App\Policies\CompanyPolicy;
use App\Policies\CompanyVerificationPolicy;
use App\Policies\FilePolicy;
use App\Policies\InterviewPolicy;
use App\Policies\JobApplicationPolicy;
use App\Policies\JobPolicy;
use App\Policies\ResumePolicy;
use App\Policies\UserPolicy;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }

    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->registerPolicies();
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perMinute(3)->by((string) $request->input('email'));
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });
    }

    private function registerPolicies(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Company::class, CompanyPolicy::class);
        Gate::policy(Job::class, JobPolicy::class);
        Gate::policy(JobApplication::class, JobApplicationPolicy::class);
        Gate::policy(Interview::class, InterviewPolicy::class);
        Gate::policy(Resume::class, ResumePolicy::class);
        Gate::policy(File::class, FilePolicy::class);
        Gate::policy(CompanyVerification::class, CompanyVerificationPolicy::class);
    }
}
