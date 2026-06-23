<?php

namespace App\Modules\Interview\Resources;

use App\Models\InterviewParticipant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin InterviewParticipant
 */
class InterviewParticipantResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_uuid' => $this->whenLoaded('user', fn () => $this->user?->uuid),
            'full_name' => $this->whenLoaded('user', fn () => $this->user?->full_name),
            'email' => $this->when(
                $request->user()?->isEmployer() || $request->user()?->isAdmin(),
                $this->whenLoaded('user', fn () => $this->user?->email)
            ),
            'role' => $this->role,
            'response_status' => $this->response_status,
        ];
    }
}
