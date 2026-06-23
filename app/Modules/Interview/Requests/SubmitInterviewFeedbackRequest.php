<?php

namespace App\Modules\Interview\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitInterviewFeedbackRequest extends FormRequest
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
            'feedback' => ['required', 'string', 'max:5000'],
            'rating' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:5'],
        ];
    }
}
