<?php

namespace App\Modules\Interview\Requests;

use App\Enums\InterviewStatus;
use App\Modules\Admin\Requests\ListRequest;
use Illuminate\Validation\Rule;

class ListInterviewsRequest extends ListRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'filter.status' => ['sometimes', 'string', Rule::enum(InterviewStatus::class)],
            'filter.application_uuid' => ['sometimes', 'uuid'],
            'filter.job_uuid' => ['sometimes', 'uuid'],
            'filter.upcoming' => ['sometimes', 'boolean'],
            'include' => ['sometimes', 'string', 'max:255', 'in:status_history'],
        ]);
    }
}
