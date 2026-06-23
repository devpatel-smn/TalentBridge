<?php

namespace App\Modules\Admin\Services;

use App\Modules\Admin\Repositories\Contracts\AdminDashboardRepositoryInterface;

class AdminDashboardService
{
    public function __construct(
        private readonly AdminDashboardRepositoryInterface $dashboard,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getDashboard(): array
    {
        return $this->dashboard->getMetrics();
    }
}
