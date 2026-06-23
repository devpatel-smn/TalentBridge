<?php

namespace App\Modules\Admin\Services;

use App\Modules\Admin\Repositories\Contracts\AdminAnalyticsRepositoryInterface;

class AnalyticsService
{
    public function __construct(
        private readonly AdminAnalyticsRepositoryInterface $analytics,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getPlatformAnalytics(): array
    {
        return $this->analytics->getPlatformAnalytics();
    }
}
