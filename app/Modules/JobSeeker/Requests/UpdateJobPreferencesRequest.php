<?php

namespace App\Modules\JobSeeker\Requests;

use App\Enums\EmploymentType;
use App\Enums\WorkMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobPreferencesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'expected_salary_min' => ['nullable', 'numeric', 'min:0'],
            'expected_salary_max' => ['nullable', 'numeric', 'min:0', 'gte:expected_salary_min'],
            'salary_currency' => ['sometimes', 'string', 'size:3'],
            'preferred_work_mode' => ['nullable', Rule::enum(WorkMode::class)],
            'preferred_employment_type' => ['nullable', Rule::enum(EmploymentType::class)],
            'willing_to_relocate' => ['sometimes', 'boolean'],
        ];
    }
}
