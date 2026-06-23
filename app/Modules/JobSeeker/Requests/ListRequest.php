<?php

namespace App\Modules\JobSeeker\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListRequest extends FormRequest
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
            'order' => ['sometimes', 'in:asc,desc'],
            'search' => ['sometimes', 'string', 'max:255'],
            'include' => ['sometimes', 'string', 'max:255'],
            'filter' => ['sometimes', 'array'],
            'filter.*' => ['nullable'],
        ];
    }
}
