<?php

namespace App\Modules\JobSeeker\Repositories\Contracts;

use App\Models\JobSeekerProfile;

interface JobSeekerProfileRepositoryInterface
{
    public function findByUserId(int $userId): ?JobSeekerProfile;

    public function findById(int $id): ?JobSeekerProfile;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(JobSeekerProfile $profile, array $attributes): JobSeekerProfile;
}
