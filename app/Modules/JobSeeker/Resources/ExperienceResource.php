<?php

namespace App\Modules\JobSeeker\Resources;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Experience
 */
class ExperienceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'job_title' => $this->job_title,
            'employment_type' => $this->employment_type?->value,
            'location' => $this->location,
            'description' => $this->description,
            'started_at' => $this->started_at?->toDateString(),
            'ended_at' => $this->ended_at?->toDateString(),
            'is_current' => $this->is_current,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
