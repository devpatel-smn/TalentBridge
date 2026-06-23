<?php

namespace App\Modules\Interview\Requests;

use App\Enums\InterviewStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInterviewStatusRequest extends FormRequest
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
            'status' => ['required', Rule::enum(InterviewStatus::class)],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'cancellation_reason' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
