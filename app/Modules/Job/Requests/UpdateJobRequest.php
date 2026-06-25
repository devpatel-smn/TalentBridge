<?php

namespace App\Modules\Job\Requests;

use App\Enums\EmploymentType;
use App\Enums\WorkMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobRequest extends FormRequest
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
            'title' => ['sometimes', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:job_categories,id'],
            'description' => ['sometimes', 'string'],
            'requirements' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'string'],
            'benefits' => ['nullable', 'string'],
            'employment_type' => ['sometimes', 'string', Rule::enum(EmploymentType::class)],
            'work_mode' => ['sometimes', 'string', Rule::enum(WorkMode::class)],
            'experience_level' => ['nullable', 'string', 'in:entry,mid,senior,lead'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'min:0'],
            'salary_currency' => ['nullable', 'string', 'size:3'],
            'salary_period' => ['sometimes', 'required', 'string', Rule::in(['hourly', 'monthly', 'yearly'])],
            'is_salary_visible' => ['sometimes', 'boolean'],
            'location_city' => ['nullable', 'string', 'max:100'],
            'location_state' => ['nullable', 'string', 'max:100'],
            'location_country' => ['nullable', 'string', 'max:100'],
            'application_deadline' => ['nullable', 'date'],
            'vacancies' => ['sometimes', 'integer', 'min:1', 'max:1000'],
            'skills' => ['nullable', 'array'],
            'skills.*.skill_id' => ['required_with:skills', 'integer', 'exists:skills,id'],
            'skills.*.is_required' => ['sometimes', 'boolean'],
        ];
    }
}
