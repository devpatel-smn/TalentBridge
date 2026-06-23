<?php

namespace App\Modules\Job\Requests;

use App\Enums\EmploymentType;
use App\Enums\WorkMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListJobsRequest extends FormRequest
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
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'sort' => ['sometimes', 'string', 'max:50'],
            'order' => ['sometimes', 'string', 'in:asc,desc'],
            'search' => ['sometimes', 'string', 'max:255'],
            'filter' => ['sometimes', 'array'],
            'filter.category_id' => ['sometimes', 'integer', 'exists:job_categories,id'],
            'filter.employment_type' => ['sometimes', 'string', Rule::enum(EmploymentType::class)],
            'filter.work_mode' => ['sometimes', 'string', Rule::enum(WorkMode::class)],
            'filter.experience_level' => ['sometimes', 'string', 'in:entry,mid,senior,lead'],
            'filter.location_city' => ['sometimes', 'string', 'max:100'],
            'filter.location_state' => ['sometimes', 'string', 'max:100'],
            'filter.location_country' => ['sometimes', 'string', 'max:100'],
            'filter.salary_min' => ['sometimes', 'numeric', 'min:0'],
            'filter.salary_max' => ['sometimes', 'numeric', 'min:0'],
            'filter.is_featured' => ['sometimes', 'boolean'],
            'include' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
