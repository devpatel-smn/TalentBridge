<?php

namespace App\Modules\JobSeeker\Requests;

use App\Enums\EmploymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExperienceRequest extends FormRequest
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
            'company_name' => ['required', 'string', 'max:255'],
            'job_title' => ['required', 'string', 'max:150'],
            'employment_type' => ['nullable', Rule::enum(EmploymentType::class)],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'started_at' => ['required', 'date'],
            'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'is_current' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
