<?php

namespace App\Modules\JobSeeker\Requests;

use App\Models\Resume;
use App\Models\ResumeSection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResumeRequest extends FormRequest
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
        $source = $this->input('source', Resume::SOURCE_UPLOAD);

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'source' => ['required', Rule::in([Resume::SOURCE_UPLOAD, Resume::SOURCE_BUILDER])],
            'is_primary' => ['sometimes', 'boolean'],
        ];

        if ($source === Resume::SOURCE_UPLOAD) {
            $rules['file_id'] = ['required', 'integer', 'exists:files,id'];
        }

        if ($source === Resume::SOURCE_BUILDER) {
            $rules['template_key'] = ['sometimes', 'string', 'max:50', Rule::in(['classic', 'modern', 'minimal', 'professional'])];
            $rules['metadata'] = ['nullable', 'array'];
            $rules['sections'] = ['sometimes', 'array'];
            $rules['sections.*.section_type'] = ['required_with:sections', Rule::in([
                ResumeSection::TYPE_SUMMARY,
                ResumeSection::TYPE_EXPERIENCE,
                ResumeSection::TYPE_EDUCATION,
                ResumeSection::TYPE_SKILLS,
                ResumeSection::TYPE_CUSTOM,
            ])];
            $rules['sections.*.title'] = ['nullable', 'string', 'max:150'];
            $rules['sections.*.content'] = ['required_with:sections', 'array'];
            $rules['sections.*.sort_order'] = ['sometimes', 'integer', 'min:0'];
            $rules['sections.*.is_visible'] = ['sometimes', 'boolean'];
        }

        return $rules;
    }
}
