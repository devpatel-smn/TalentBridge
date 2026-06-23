<?php

namespace App\Modules\Notification\Support;

use App\Enums\NotificationType;

final class NotificationData
{
    /**
     * @param  array<string, mixed>  $meta
     */
    public function __construct(
        public readonly NotificationType $type,
        public readonly string $title,
        public readonly string $body,
        public readonly ?string $actionUrl = null,
        public readonly ?string $icon = null,
        public readonly ?string $entityType = null,
        public readonly ?int $entityId = null,
        public readonly ?string $entityUuid = null,
        public readonly array $meta = [],
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'notification_type' => $this->type->value,
            'title' => $this->title,
            'body' => $this->body,
            'action_url' => $this->actionUrl,
            'icon' => $this->icon,
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'entity_uuid' => $this->entityUuid,
            'meta' => $this->meta !== [] ? $this->meta : null,
        ], fn (mixed $value) => $value !== null);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public static function fromArray(array $payload): self
    {
        return new self(
            type: NotificationType::from((string) ($payload['notification_type'] ?? NotificationType::System->value)),
            title: (string) ($payload['title'] ?? ''),
            body: (string) ($payload['body'] ?? ''),
            actionUrl: isset($payload['action_url']) ? (string) $payload['action_url'] : null,
            icon: isset($payload['icon']) ? (string) $payload['icon'] : null,
            entityType: isset($payload['entity_type']) ? (string) $payload['entity_type'] : null,
            entityId: isset($payload['entity_id']) ? (int) $payload['entity_id'] : null,
            entityUuid: isset($payload['entity_uuid']) ? (string) $payload['entity_uuid'] : null,
            meta: (array) ($payload['meta'] ?? []),
        );
    }
}
