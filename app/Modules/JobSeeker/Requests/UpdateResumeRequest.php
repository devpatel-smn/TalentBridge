<?php

namespace App\Modules\JobSeeker\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResumeRequest extends FormRequest
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
            'file_id' => ['sometimes', 'integer', 'exists:files,id'],
            'template_key' => ['sometimes', 'string', 'max:50'],
            'metadata' => ['nullable', 'array'],
            'is_primary' => ['sometimes', 'boolean'],
        ];
    }
}
