<?php

namespace App\Modules\Interview;

use App\Modules\Interview\Repositories\Contracts\InterviewRepositoryInterface;
use App\Modules\Interview\Repositories\InterviewRepository;
use Illuminate\Support\ServiceProvider;

class InterviewServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(InterviewRepositoryInterface::class, InterviewRepository::class);
    }
}
