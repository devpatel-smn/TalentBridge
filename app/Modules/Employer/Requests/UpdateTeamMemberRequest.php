<?php

namespace App\Modules\Employer\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamMemberRequest extends FormRequest
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
            'job_title' => ['sometimes', 'nullable', 'string', 'max:100'],
            'is_primary' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
