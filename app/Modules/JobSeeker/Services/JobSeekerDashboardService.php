<?php

namespace App\Modules\JobSeeker\Services;

use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerDashboardRepositoryInterface;

class JobSeekerDashboardService
{
    public function __construct(
        private readonly JobSeekerDashboardRepositoryInterface $dashboard,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getDashboard(int $profileId, int $userId): array
    {
        return $this->dashboard->getMetrics($profileId, $userId);
    }
}
