<?php

namespace App\Modules\JobSeeker\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:20'],
            'headline' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'current_title' => ['nullable', 'string', 'max:150'],
            'years_of_experience' => ['nullable', 'numeric', 'min:0', 'max:99.9'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'location_city' => ['nullable', 'string', 'max:100'],
            'location_state' => ['nullable', 'string', 'max:100'],
            'location_country' => ['nullable', 'string', 'max:100'],
            'is_open_to_work' => ['sometimes', 'boolean'],
            'is_profile_public' => ['sometimes', 'boolean'],
            'resume_file_id' => ['nullable', 'integer', 'exists:files,id'],
        ];
    }
}
