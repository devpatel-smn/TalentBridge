<?php

namespace App\Modules\Application\Resources;

use App\Models\ApplicationStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ApplicationStatusHistory
 */
class ApplicationStatusHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'from_status' => $this->from_status?->value,
            'to_status' => $this->to_status->value,
            'notes' => $this->notes,
            'changed_at' => $this->created_at?->toIso8601String(),
            'changed_by' => $this->whenLoaded('changedByUser', fn () => $this->changedByUser ? [
                'uuid' => $this->changedByUser->uuid,
                'full_name' => $this->changedByUser->full_name,
            ] : null),
        ];
    }
}
