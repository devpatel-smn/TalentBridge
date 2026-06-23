<?php

namespace App\Modules\JobSeeker\Repositories;

use App\Enums\InterviewStatus;
use App\Enums\JobStatus;
use App\Models\Interview;
use App\Models\JobApplication;
use App\Models\JobRecommendation;
use App\Models\JobSeekerProfile;
use App\Models\Resume;
use App\Models\SavedJob;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerDashboardRepositoryInterface;

class JobSeekerDashboardRepository implements JobSeekerDashboardRepositoryInterface
{
    public function getMetrics(int $profileId, int $userId): array
    {
        $applicationsQuery = JobApplication::query()
            ->where('job_seeker_profile_id', $profileId)
            ->whereNull('deleted_at');

        $interviewsQuery = Interview::query()
            ->whereNull('deleted_at')
            ->whereHas('jobApplication', fn ($query) => $query
                ->where('job_seeker_profile_id', $profileId)
                ->whereNull('deleted_at'));

        return [
            'profile_completion' => (int) (JobSeekerProfile::query()
                ->where('id', $profileId)
                ->value('profile_completion') ?? 0),
            'saved_jobs' => SavedJob::query()
                ->where('job_seeker_profile_id', $profileId)
                ->whereHas('job', fn ($query) => $query
                    ->where('status', JobStatus::Published)
                    ->whereNull('deleted_at'))
                ->count(),
            'applications' => [
                'total' => (clone $applicationsQuery)->count(),
            ],
            'interviews' => [
                'upcoming' => (clone $interviewsQuery)
                    ->where('scheduled_at', '>=', now())
                    ->whereIn('status', [
                        InterviewStatus::Scheduled,
                        InterviewStatus::Confirmed,
                    ])
                    ->count(),
                'total' => (clone $interviewsQuery)->count(),
            ],
            'recommendations' => [
                'active' => JobRecommendation::query()
                    ->where('job_seeker_profile_id', $profileId)
                    ->where('is_dismissed', false)
                    ->where(fn ($query) => $query
                        ->whereNull('expires_at')
                        ->orWhere('expires_at', '>=', now()))
                    ->count(),
            ],
            'resumes' => [
                'total' => Resume::query()
                    ->where('job_seeker_profile_id', $profileId)
                    ->whereNull('deleted_at')
                    ->count(),
            ],
        ];
    }
}
