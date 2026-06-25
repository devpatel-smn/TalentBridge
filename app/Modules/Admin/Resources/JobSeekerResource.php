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
            'expected_salary_min' => $this->expected_salary_min,
            'expected_salary_max' => $this->expected_salary_max,
            'salary_currency' => $this->salary_currency,
            'location_city' => $this->location_city,
            'location_state' => $this->location_state,
            'location_country' => $this->location_country,
            'linkedin_url' => $this->linkedin_url,
            'portfolio_url' => $this->portfolio_url,
            'profile_completion' => $this->profile_completion,
            'is_open_to_work' => $this->is_open_to_work,
            'is_profile_public' => $this->is_profile_public,
            'willing_to_relocate' => $this->willing_to_relocate,
            'preferred_work_mode' => $this->preferred_work_mode?->value,
            'preferred_employment_type' => $this->preferred_employment_type?->value,
            'user' => $this->whenLoaded('user', fn () => new AdminUserResource($this->user)),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
                'proficiency_level' => $skill->pivot->proficiency_level,
            ])->values()),
            'experiences' => $this->whenLoaded('experiences', fn () => $this->experiences->map(fn ($exp) => [
                'company_name' => $exp->company_name,
                'job_title' => $exp->job_title,
                'employment_type' => $exp->employment_type?->value,
                'location' => $exp->location,
                'description' => $exp->description,
                'started_at' => $exp->started_at?->toDateString(),
                'ended_at' => $exp->ended_at?->toDateString(),
                'is_current' => $exp->is_current,
            ])->values()),
            'educations' => $this->whenLoaded('educations', fn () => $this->educations->map(fn ($edu) => [
                'institution' => $edu->institution,
                'degree' => $edu->degree,
                'field_of_study' => $edu->field_of_study,
                'grade' => $edu->grade,
                'description' => $edu->description,
                'started_at' => $edu->started_at?->toDateString(),
                'ended_at' => $edu->ended_at?->toDateString(),
                'is_current' => $edu->is_current,
            ])->values()),
            'resumes' => $this->whenLoaded('resumes', fn () => $this->resumes->map(fn ($resume) => [
                'uuid' => $resume->uuid,
                'title' => $resume->title,
                'is_primary' => $resume->is_primary,
                'source' => $resume->source,
                'created_at' => $resume->created_at?->toIso8601String(),
            ])->values()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
