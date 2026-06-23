<?php

namespace App\Modules\Employer\Repositories\Contracts;

interface EmployerDashboardRepositoryInterface
{
    /**
     * @return array<string, mixed>
     */
    public function getMetrics(int $companyId): array;
}
