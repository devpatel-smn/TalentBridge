<?php

namespace App\Modules\JobSeeker\Requests;

use App\Models\ResumeSection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateResumeSectionsRequest extends FormRequest
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
            'sections' => ['required', 'array', 'min:1'],
            'sections.*.section_type' => ['required', Rule::in([
                ResumeSection::TYPE_SUMMARY,
                ResumeSection::TYPE_EXPERIENCE,
                ResumeSection::TYPE_EDUCATION,
                ResumeSection::TYPE_SKILLS,
                ResumeSection::TYPE_CUSTOM,
            ])],
            'sections.*.title' => ['nullable', 'string', 'max:150'],
            'sections.*.content' => ['required', 'array'],
            'sections.*.sort_order' => ['sometimes', 'integer', 'min:0'],
            'sections.*.is_visible' => ['sometimes', 'boolean'],
        ];
    }
}
