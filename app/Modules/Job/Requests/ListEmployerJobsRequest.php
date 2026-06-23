<?php

namespace App\Modules\Job\Requests;

use App\Enums\JobStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListEmployerJobsRequest extends FormRequest
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
            'filter.status' => ['sometimes', 'string', Rule::enum(JobStatus::class)],
            'filter.category_id' => ['sometimes', 'integer', 'exists:job_categories,id'],
            'filter.employment_type' => ['sometimes', 'string'],
            'filter.work_mode' => ['sometimes', 'string'],
            'filter.location_city' => ['sometimes', 'string', 'max:100'],
            'filter.location_state' => ['sometimes', 'string', 'max:100'],
            'filter.location_country' => ['sometimes', 'string', 'max:100'],
            'include' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
