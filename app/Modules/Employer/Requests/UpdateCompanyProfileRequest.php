<?php

namespace App\Modules\Employer\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyProfileRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'website' => ['nullable', 'url', 'max:255'],
            'industry' => ['nullable', 'string', 'max:100'],
            'company_size' => ['nullable', 'string', 'max:50'],
            'founded_year' => ['nullable', 'integer', 'min:1800', 'max:'.date('Y')],
            'headquarters' => ['nullable', 'string', 'max:255'],
            'social_links' => ['nullable', 'array'],
            'logo_file_id' => ['nullable', 'integer', 'exists:files,id'],
        ];
    }
}
