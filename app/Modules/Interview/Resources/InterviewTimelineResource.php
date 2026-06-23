<?php

namespace App\Modules\Interview\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterviewTimelineResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array<string, mixed> $data */
        $data = $this->resource;

        return [
            'interview_uuid' => $data['interview_uuid'] ?? null,
            'current_status' => $data['current_status'] ?? null,
            'events' => $data['events'] ?? [],
        ];
    }
}
