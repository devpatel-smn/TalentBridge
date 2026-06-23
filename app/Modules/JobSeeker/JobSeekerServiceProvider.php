<?php

namespace App\Modules\JobSeeker;

use App\Models\Education;
use App\Models\Experience;
use App\Models\JobSeekerSkill;
use App\Models\SavedJob;
use App\Modules\JobSeeker\Repositories\Contracts\EducationRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerDashboardRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerProfileRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerSkillRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\ResumeRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\SavedJobRepositoryInterface;
use App\Modules\JobSeeker\Repositories\EducationRepository;
use App\Modules\JobSeeker\Repositories\ExperienceRepository;
use App\Modules\JobSeeker\Repositories\JobSeekerDashboardRepository;
use App\Modules\JobSeeker\Repositories\JobSeekerProfileRepository;
use App\Modules\JobSeeker\Repositories\JobSeekerSkillRepository;
use App\Modules\JobSeeker\Repositories\ResumeRepository;
use App\Modules\JobSeeker\Repositories\SavedJobRepository;
use App\Policies\EducationPolicy;
use App\Policies\ExperiencePolicy;
use App\Policies\JobSeekerSkillPolicy;
use App\Policies\SavedJobPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class JobSeekerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(JobSeekerProfileRepositoryInterface::class, JobSeekerProfileRepository::class);
        $this->app->bind(ExperienceRepositoryInterface::class, ExperienceRepository::class);
        $this->app->bind(EducationRepositoryInterface::class, EducationRepository::class);
        $this->app->bind(JobSeekerSkillRepositoryInterface::class, JobSeekerSkillRepository::class);
        $this->app->bind(ResumeRepositoryInterface::class, ResumeRepository::class);
        $this->app->bind(SavedJobRepositoryInterface::class, SavedJobRepository::class);
        $this->app->bind(JobSeekerDashboardRepositoryInterface::class, JobSeekerDashboardRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(Experience::class, ExperiencePolicy::class);
        Gate::policy(Education::class, EducationPolicy::class);
        Gate::policy(JobSeekerSkill::class, JobSeekerSkillPolicy::class);
        Gate::policy(SavedJob::class, SavedJobPolicy::class);
    }
}
