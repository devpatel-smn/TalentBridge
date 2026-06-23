<?php

namespace App\Modules\JobSeeker\Requests;

use App\Enums\EmploymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExperienceRequest extends FormRequest
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
            'company_name' => ['sometimes', 'string', 'max:255'],
            'job_title' => ['sometimes', 'string', 'max:150'],
            'employment_type' => ['nullable', Rule::enum(EmploymentType::class)],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'started_at' => ['sometimes', 'date'],
            'ended_at' => ['nullable', 'date'],
            'is_current' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
