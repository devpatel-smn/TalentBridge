<?php

namespace App\Modules\Job\Requests;

use App\Enums\VerificationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListCompaniesRequest extends FormRequest
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
            'filter.industry' => ['sometimes', 'string', 'max:100'],
            'filter.headquarters' => ['sometimes', 'string', 'max:255'],
            'filter.verification_status' => ['sometimes', 'string', Rule::enum(VerificationStatus::class)],
            'filter.company_size' => ['sometimes', 'string', 'max:50'],
        ];
    }
}
