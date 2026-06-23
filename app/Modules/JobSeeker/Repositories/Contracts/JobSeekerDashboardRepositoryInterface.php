<?php

namespace App\Modules\JobSeeker\Repositories\Contracts;

interface JobSeekerDashboardRepositoryInterface
{
    /**
     * @return array<string, mixed>
     */
    public function getMetrics(int $profileId, int $userId): array;
}
