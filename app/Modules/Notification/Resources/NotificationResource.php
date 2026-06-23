<?php

namespace App\Modules\Notification\Resources;

use App\Models\DatabaseNotification;
use App\Modules\Notification\Support\NotificationData;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DatabaseNotification */
class NotificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $payload = NotificationData::fromArray((array) $this->data);

        return [
            'id' => $this->id,
            'type' => class_basename($this->type),
            'notification_type' => $payload->type->value,
            'title' => $payload->title,
            'body' => $payload->body,
            'action_url' => $payload->actionUrl,
            'icon' => $payload->icon,
            'entity_type' => $payload->entityType,
            'entity_id' => $payload->entityId,
            'entity_uuid' => $payload->entityUuid,
            'meta' => $payload->meta !== [] ? $payload->meta : null,
            'is_read' => $this->read_at !== null,
            'read_at' => $this->read_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
