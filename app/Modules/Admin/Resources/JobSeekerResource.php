<?php

namespace App\Modules\Admin\Resources;

use App\Models\JobSeekerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin JobSeekerProfile
 */
class JobSeekerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'headline' => $this->headline,
            'summary' => $this->summary,
            'current_title' => $this->current_title,
            'years_of_experience' => $this->years_of_experience,
            'location_city' => $this->location_city,
            'location_state' => $this->location_state,
            'location_country' => $this->location_country,
            'profile_completion' => $this->profile_completion,
            'is_open_to_work' => $this->is_open_to_work,
            'is_profile_public' => $this->is_profile_public,
            'preferred_work_mode' => $this->preferred_work_mode?->value,
            'preferred_employment_type' => $this->preferred_employment_type?->value,
            'user' => $this->whenLoaded('user', fn () => new AdminUserResource($this->user)),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
                'proficiency_level' => $skill->pivot->proficiency_level,
            ])->values()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
