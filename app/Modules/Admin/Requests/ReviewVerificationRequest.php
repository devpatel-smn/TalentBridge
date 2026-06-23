<?php

namespace App\Modules\Admin\Requests;

use App\Enums\VerificationStatus;
use App\Models\CompanyVerification;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('review', CompanyVerification::class) ?? false;
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
                Rule::in([
                    VerificationStatus::Approved->value,
                    VerificationStatus::Rejected->value,
                    VerificationStatus::ResubmissionRequired->value,
                    VerificationStatus::UnderReview->value,
                ]),
            ],
            'reviewer_notes' => ['nullable', 'string', 'max:2000'],
            'rejection_reason' => [
                'required_if:status,'.VerificationStatus::Rejected->value,
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }
}
