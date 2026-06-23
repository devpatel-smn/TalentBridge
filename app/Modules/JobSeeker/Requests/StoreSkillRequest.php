<?php

namespace App\Modules\JobSeeker\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
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
            'skill_id' => ['required_without:skill_name', 'integer', 'exists:skills,id'],
            'skill_name' => ['required_without:skill_id', 'string', 'max:100'],
            'proficiency_level' => ['required', 'integer', 'min:1', 'max:5'],
            'years_of_experience' => ['nullable', 'numeric', 'min:0', 'max:99.9'],
        ];
    }
}
