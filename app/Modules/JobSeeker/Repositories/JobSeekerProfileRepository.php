<?php

namespace App\Modules\JobSeeker\Repositories;

use App\Models\JobSeekerProfile;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerProfileRepositoryInterface;

class JobSeekerProfileRepository implements JobSeekerProfileRepositoryInterface
{
    public function findByUserId(int $userId): ?JobSeekerProfile
    {
        return JobSeekerProfile::query()
            ->with(['user', 'resumeFile', 'skills'])
            ->where('user_id', $userId)
            ->first();
    }

    public function findById(int $id): ?JobSeekerProfile
    {
        return JobSeekerProfile::query()->find($id);
    }

    public function update(JobSeekerProfile $profile, array $attributes): JobSeekerProfile
    {
        $profile->update($attributes);

        return $profile->fresh([
            'user',
            'resumeFile',
            'skills',
            'experiences',
            'educations',
            'resumes',
        ]);
    }
}
