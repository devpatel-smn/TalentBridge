<?php

namespace App\Modules\Admin\Resources;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Job
 */
class JobResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'responsibilities' => $this->responsibilities,
            'benefits' => $this->benefits,
            'employment_type' => $this->employment_type->value,
            'work_mode' => $this->work_mode->value,
            'experience_level' => $this->experience_level,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'salary_currency' => $this->salary_currency,
            'is_salary_visible' => $this->is_salary_visible,
            'location_city' => $this->location_city,
            'location_state' => $this->location_state,
            'location_country' => $this->location_country,
            'vacancies' => $this->vacancies,
            'status' => $this->status->value,
            'published_at' => $this->published_at?->toIso8601String(),
            'closed_at' => $this->closed_at?->toIso8601String(),
            'views_count' => $this->views_count,
            'applications_count' => $this->applications_count,
            'company' => $this->whenLoaded('company', fn () => new CompanyResource($this->company)),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
                'is_required' => (bool) $skill->pivot->is_required,
            ])->values()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
