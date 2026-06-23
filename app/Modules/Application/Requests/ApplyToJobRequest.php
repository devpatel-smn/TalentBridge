<?php

namespace App\Modules\Application\Requests;

use App\Models\JobApplication;
use Illuminate\Foundation\Http\FormRequest;

class ApplyToJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', JobApplication::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'resume_uuid' => ['nullable', 'uuid', 'exists:resumes,uuid'],
            'cover_letter' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
