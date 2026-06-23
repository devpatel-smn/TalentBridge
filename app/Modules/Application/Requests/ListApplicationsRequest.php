<?php

namespace App\Modules\Application\Requests;

use App\Enums\ApplicationStatus;
use App\Modules\Admin\Requests\ListRequest;
use Illuminate\Validation\Rule;

class ListApplicationsRequest extends ListRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'filter.status' => ['sometimes', 'string', Rule::enum(ApplicationStatus::class)],
            'filter.job_uuid' => ['sometimes', 'uuid'],
            'include' => ['sometimes', 'string', 'max:255', 'in:status_history'],
        ]);
    }
}
