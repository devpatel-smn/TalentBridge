<?php

namespace App\Modules\Admin\Resources;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ActivityLog
 */
class ActivityLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'activity_type' => $this->activity_type,
            'description' => $this->description,
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'properties' => $this->properties,
            'user' => $this->whenLoaded('user', fn () => $this->user ? [
                'id' => $this->user->id,
                'uuid' => $this->user->uuid,
                'full_name' => $this->user->full_name,
                'email' => $this->user->email,
            ] : null),
            'company' => $this->whenLoaded('company', fn () => $this->company ? [
                'uuid' => $this->company->uuid,
                'name' => $this->company->name,
            ] : null),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
