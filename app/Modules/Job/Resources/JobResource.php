<?php

namespace App\Modules\Job\Resources;

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
            'employment_type' => $this->employment_type->value,
            'work_mode' => $this->work_mode->value,
            'experience_level' => $this->experience_level,
            'salary_min' => $this->when($this->is_salary_visible, $this->salary_min),
            'salary_max' => $this->when($this->is_salary_visible, $this->salary_max),
            'salary_currency' => $this->when($this->is_salary_visible, $this->salary_currency),
            'salary_period' => $this->salary_period,
            'is_salary_visible' => $this->is_salary_visible,
            'location_city' => $this->location_city,
            'location_state' => $this->location_state,
            'location_country' => $this->location_country,
            'vacancies' => $this->vacancies,
            'status' => $this->status->value,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at?->toIso8601String(),
            'application_deadline' => $this->application_deadline?->toDateString(),
            'company' => $this->whenLoaded('company', fn () => new CompanySummaryResource($this->company)),
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
                'is_required' => (bool) $skill->pivot->is_required,
            ])->values()),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
