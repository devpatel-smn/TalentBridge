<?php

namespace App\Modules\JobSeeker\Resources;

use App\Models\JobSeekerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin JobSeekerProfile
 */
class ProfileResource extends JsonResource
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
            'expected_salary_min' => $this->expected_salary_min,
            'expected_salary_max' => $this->expected_salary_max,
            'salary_currency' => $this->salary_currency,
            'preferred_work_mode' => $this->preferred_work_mode?->value,
            'preferred_employment_type' => $this->preferred_employment_type?->value,
            'willing_to_relocate' => $this->willing_to_relocate,
            'location_city' => $this->location_city,
            'location_state' => $this->location_state,
            'location_country' => $this->location_country,
            'linkedin_url' => $this->linkedin_url,
            'portfolio_url' => $this->portfolio_url,
            'profile_completion' => $this->profile_completion,
            'is_open_to_work' => $this->is_open_to_work,
            'is_profile_public' => $this->is_profile_public,
            'resume_file' => $this->whenLoaded('resumeFile', fn () => $this->resumeFile ? [
                'uuid' => $this->resumeFile->uuid,
                'original_name' => $this->resumeFile->original_name,
            ] : null),
            'user' => $this->whenLoaded('user', fn () => [
                'uuid' => $this->user->uuid,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
            ]),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
                'proficiency_level' => $skill->pivot->proficiency_level,
                'years_of_experience' => $skill->pivot->years_of_experience,
            ])->values()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
