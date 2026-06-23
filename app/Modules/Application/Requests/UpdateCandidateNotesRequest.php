<?php

namespace App\Modules\Application\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCandidateNotesRequest extends FormRequest
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
            'employer_notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
