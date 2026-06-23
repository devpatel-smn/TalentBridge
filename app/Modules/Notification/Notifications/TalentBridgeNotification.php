<?php

namespace App\Modules\Notification\Notifications;

use App\Enums\NotificationType;
use App\Modules\Notification\Notifications\Concerns\RespectsNotificationPreferences;
use App\Modules\Notification\Support\NotificationData;
use App\Modules\Notification\Support\NotificationTemplates;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

abstract class TalentBridgeNotification extends Notification implements ShouldQueue
{
    use Queueable;
    use RespectsNotificationPreferences;

    public function __construct(
        protected NotificationData $data,
    ) {
        $this->onQueue('notifications');
    }

    abstract public function notificationType(): NotificationType;

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return $this->resolveChannels($notifiable);
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return $this->data->toArray();
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim((string) config('talentbridge.frontend_url'), '/');
        $actionUrl = $this->data->actionUrl;

        if ($actionUrl !== null && ! str_starts_with($actionUrl, 'http')) {
            $actionUrl = $frontendUrl.'/'.ltrim($actionUrl, '/');
        }

        return (new MailMessage)
            ->subject($this->data->title)
            ->markdown(NotificationTemplates::emailViewFor($this->notificationType()), [
                'title' => $this->data->title,
                'body' => $this->data->body,
                'actionUrl' => $actionUrl,
                'recipientName' => method_exists($notifiable, 'getFullNameAttribute')
                    ? $notifiable->full_name
                    : ($notifiable->name ?? 'there'),
            ]);
    }
}
