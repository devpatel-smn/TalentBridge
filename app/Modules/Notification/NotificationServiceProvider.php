<?php

namespace App\Modules\Notification;

use App\Models\DatabaseNotification;
use App\Models\NotificationPreference;
use App\Modules\Notification\Repositories\Contracts\NotificationPreferenceRepositoryInterface;
use App\Modules\Notification\Repositories\Contracts\NotificationRepositoryInterface;
use App\Modules\Notification\Repositories\NotificationPreferenceRepository;
use App\Modules\Notification\Repositories\NotificationRepository;
use App\Policies\DatabaseNotificationPolicy;
use App\Policies\NotificationPreferencePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(NotificationRepositoryInterface::class, NotificationRepository::class);
        $this->app->bind(NotificationPreferenceRepositoryInterface::class, NotificationPreferenceRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(DatabaseNotification::class, DatabaseNotificationPolicy::class);
        Gate::policy(NotificationPreference::class, NotificationPreferencePolicy::class);
    }
}
