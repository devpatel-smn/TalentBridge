<?php

namespace App\Modules\Employer\Services;

use App\Modules\Employer\Repositories\Contracts\EmployerDashboardRepositoryInterface;

class EmployerDashboardService
{
    public function __construct(
        private readonly EmployerDashboardRepositoryInterface $dashboard,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getDashboard(int $companyId): array
    {
        return $this->dashboard->getMetrics($companyId);
    }
}
