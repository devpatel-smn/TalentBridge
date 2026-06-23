<?php

namespace App\Modules\Employer\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitVerificationRequest extends FormRequest
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
            'business_registration_number' => ['nullable', 'string', 'max:100'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'documents' => ['nullable', 'array'],
            'documents.*' => ['integer', 'exists:files,id'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $hasIdentifier = filled($this->input('business_registration_number'))
                || filled($this->input('tax_id'));
            $hasDocuments = is_array($this->input('documents')) && count($this->input('documents')) > 0;

            if (! $hasIdentifier && ! $hasDocuments) {
                $validator->errors()->add(
                    'verification',
                    'Provide a business registration number, tax ID, or at least one document.'
                );
            }
        });
    }
}
