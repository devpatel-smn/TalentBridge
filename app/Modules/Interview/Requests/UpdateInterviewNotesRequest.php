<?php

namespace App\Modules\Interview\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInterviewNotesRequest extends FormRequest
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
            'instructions' => ['required', 'nullable', 'string', 'max:5000'],
        ];
    }
}
