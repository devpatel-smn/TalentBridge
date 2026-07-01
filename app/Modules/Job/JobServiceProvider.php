<?php

namespace App\Modules\Job;

use App\Modules\Job\Repositories\Contracts\JobCategoryRepositoryInterface;
use App\Modules\Job\Repositories\Contracts\JobRepositoryInterface;
use App\Modules\Job\Repositories\Contracts\PublicCompanyRepositoryInterface;
use App\Modules\Job\Repositories\Contracts\SkillRepositoryInterface;
use App\Modules\Job\Repositories\JobCategoryRepository;
use App\Modules\Job\Repositories\JobRepository;
use App\Modules\Job\Repositories\PublicCompanyRepository;
use App\Modules\Job\Repositories\SkillRepository;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class JobServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(JobRepositoryInterface::class, JobRepository::class);
        $this->app->bind(JobCategoryRepositoryInterface::class, JobCategoryRepository::class);
        $this->app->bind(SkillRepositoryInterface::class, SkillRepository::class);
        $this->app->bind(PublicCompanyRepositoryInterface::class, PublicCompanyRepository::class);
    }

    public function boot(): void
    {
        RateLimiter::for('public-jobs', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });
    }
}
