<?php

namespace App\Modules\Interview\Resources;

use App\Models\InterviewStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin InterviewStatusHistory
 */
class InterviewStatusHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'from_status' => $this->from_status?->value,
            'to_status' => $this->to_status->value,
            'notes' => $this->notes,
            'changed_by' => $this->whenLoaded('changedByUser', fn () => $this->changedByUser ? [
                'uuid' => $this->changedByUser->uuid,
                'full_name' => $this->changedByUser->full_name,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
