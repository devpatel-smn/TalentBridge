<?php

namespace App\Modules\Employer\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InviteTeamMemberRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'is_primary' => ['sometimes', 'boolean'],
        ];
    }
}
