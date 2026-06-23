<?php

namespace App\Modules\JobSeeker\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEducationRequest extends FormRequest
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
            'institution' => ['sometimes', 'string', 'max:255'],
            'degree' => ['sometimes', 'string', 'max:150'],
            'field_of_study' => ['nullable', 'string', 'max:150'],
            'grade' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'started_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date'],
            'is_current' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
