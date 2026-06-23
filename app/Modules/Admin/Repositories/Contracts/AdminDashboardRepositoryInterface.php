<?php

namespace App\Modules\Admin\Repositories\Contracts;

interface AdminDashboardRepositoryInterface
{
    /**
     * @return array<string, mixed>
     */
    public function getMetrics(): array;
}
