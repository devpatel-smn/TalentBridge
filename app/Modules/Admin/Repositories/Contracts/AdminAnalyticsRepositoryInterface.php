<?php

namespace App\Modules\Admin\Repositories\Contracts;

interface AdminAnalyticsRepositoryInterface
{
    /**
     * @return array<string, mixed>
     */
    public function getPlatformAnalytics(): array;
}
