<?php

use App\Modules\Admin\AdminServiceProvider;
use App\Modules\Application\ApplicationServiceProvider;
use App\Modules\Auth\AuthServiceProvider;
use App\Modules\Employer\EmployerServiceProvider;
use App\Modules\Interview\InterviewServiceProvider;
use App\Modules\Job\JobServiceProvider;
use App\Modules\JobSeeker\JobSeekerServiceProvider;
use App\Modules\Notification\NotificationServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    AuthServiceProvider::class,
    AdminServiceProvider::class,
    ApplicationServiceProvider::class,
    EmployerServiceProvider::class,
    InterviewServiceProvider::class,
    JobServiceProvider::class,
    JobSeekerServiceProvider::class,
    NotificationServiceProvider::class,
];
