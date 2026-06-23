<?php

namespace App\Modules\Employer\Resources;

use App\Models\EmployerUser;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin EmployerUser
 */
class TeamMemberResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_title' => $this->job_title,
            'is_primary' => $this->is_primary,
            'is_active' => $this->is_active,
            'joined_at' => $this->joined_at?->toIso8601String(),
            'user' => $this->whenLoaded('user', fn () => [
                'uuid' => $this->user->uuid,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'full_name' => $this->user->full_name,
                'email' => $this->user->email,
            ]),
            'invited_by' => $this->whenLoaded('inviter', fn () => $this->inviter ? [
                'uuid' => $this->inviter->uuid,
                'full_name' => $this->inviter->full_name,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
