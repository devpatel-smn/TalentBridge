<?php

namespace App\Modules\Admin\Resources;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AuditLog
 */
class AuditLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action' => $this->action->value,
            'auditable_type' => $this->auditable_type,
            'auditable_id' => $this->auditable_id,
            'old_values' => $this->old_values,
            'new_values' => $this->new_values,
            'ip_address' => $this->ip_address,
            'user' => $this->whenLoaded('user', fn () => $this->user ? [
                'id' => $this->user->id,
                'uuid' => $this->user->uuid,
                'full_name' => $this->user->full_name,
                'email' => $this->user->email,
            ] : null),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
