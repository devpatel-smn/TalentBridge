<?php

namespace App\Modules\Notification\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkNotificationActionRequest extends FormRequest
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
            'ids' => ['sometimes', 'array'],
            'ids.*' => ['required', 'uuid'],
        ];
    }
}
