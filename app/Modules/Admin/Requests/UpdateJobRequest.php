<?php

namespace App\Modules\Admin\Requests;

use App\Enums\JobStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobRequest extends FormRequest
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
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'requirements' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'string'],
            'benefits' => ['nullable', 'string'],
            'vacancies' => ['sometimes', 'integer', 'min:1', 'max:1000'],
            'status' => ['sometimes', 'string', Rule::enum(JobStatus::class)],
        ];
    }
}
