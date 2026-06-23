<?php

namespace App\Modules\Notification\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin array<string, mixed> */
class NotificationPreferenceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'notification_type' => $this->resource['notification_type'],
            'label' => $this->resource['label'],
            'channel_mail' => $this->resource['channel_mail'],
            'channel_database' => $this->resource['channel_database'],
            'channel_push' => $this->resource['channel_push'],
            'is_configured' => $this->resource['is_configured'],
            'mail_locked' => $this->resource['mail_locked'],
        ];
    }
}
