<?php

namespace App\Modules\JobSeeker\Resources;

use App\Models\JobSeekerSkill;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin JobSeekerSkill
 */
class JobSeekerSkillResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'skill_id' => $this->skill_id,
            'name' => $this->skill?->name,
            'category' => $this->skill?->category,
            'proficiency_level' => $this->proficiency_level,
            'years_of_experience' => $this->years_of_experience,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
