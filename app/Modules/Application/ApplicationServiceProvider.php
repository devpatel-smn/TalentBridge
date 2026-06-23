<?php

namespace App\Modules\Application;

use App\Modules\Application\Repositories\Contracts\JobApplicationRepositoryInterface;
use App\Modules\Application\Repositories\JobApplicationRepository;
use Illuminate\Support\ServiceProvider;

class ApplicationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(JobApplicationRepositoryInterface::class, JobApplicationRepository::class);
    }
}
