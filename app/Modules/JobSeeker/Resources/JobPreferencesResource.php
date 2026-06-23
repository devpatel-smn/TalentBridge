<?php

namespace App\Modules\JobSeeker\Resources;

use App\Models\JobSeekerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin JobSeekerProfile
 */
class JobPreferencesResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'expected_salary_min' => $this->expected_salary_min,
            'expected_salary_max' => $this->expected_salary_max,
            'salary_currency' => $this->salary_currency,
            'preferred_work_mode' => $this->preferred_work_mode?->value,
            'preferred_employment_type' => $this->preferred_employment_type?->value,
            'willing_to_relocate' => $this->willing_to_relocate,
        ];
    }
}
