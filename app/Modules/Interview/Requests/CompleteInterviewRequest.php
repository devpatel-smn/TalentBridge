<?php

namespace App\Modules\Interview\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompleteInterviewRequest extends FormRequest
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
            'feedback' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'rating' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:5'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
