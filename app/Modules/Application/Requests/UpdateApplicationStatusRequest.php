<?php

namespace App\Modules\Application\Requests;

use App\Enums\ApplicationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationStatusRequest extends FormRequest
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
            'status' => [
                'required',
                'string',
                Rule::enum(ApplicationStatus::class),
                Rule::notIn([
                    ApplicationStatus::Submitted->value,
                    ApplicationStatus::InterviewScheduled->value,
                    ApplicationStatus::Interviewed->value,
                    ApplicationStatus::Withdrawn->value,
                ]),
            ],
            'notes' => ['nullable', 'string', 'max:2000'],
            'employer_notes' => ['nullable', 'string', 'max:5000'],
            'rejection_reason' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
