<?php

namespace App\Modules\Employer\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanySettingsRequest extends FormRequest
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
            'subscription_tier' => ['sometimes', 'string', 'max:50'],
            'default_timezone' => ['sometimes', 'string', 'max:50'],
            'application_notifications' => ['sometimes', 'boolean'],
            'public_profile_enabled' => ['sometimes', 'boolean'],
            'branding' => ['nullable', 'array'],
        ];
    }
}
