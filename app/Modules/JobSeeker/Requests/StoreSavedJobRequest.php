<?php

namespace App\Modules\JobSeeker\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSavedJobRequest extends FormRequest
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
            'job_uuid' => ['required', 'uuid', 'exists:jobs,uuid'],
        ];
    }
}
