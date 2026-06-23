<?php

namespace App\Modules\Job\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListSkillsRequest extends FormRequest
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
            'search' => ['sometimes', 'string', 'max:100'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }
}
