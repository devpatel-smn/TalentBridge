<?php

namespace App\Modules\Notification\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListNotificationsRequest extends FormRequest
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
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'sort' => ['sometimes', 'string', 'in:created_at,read_at'],
            'order' => ['sometimes', 'string', 'in:asc,desc'],
            'filter' => ['sometimes', 'array'],
            'filter.read' => ['sometimes', 'boolean'],
            'filter.notification_type' => ['sometimes', 'string'],
        ];
    }
}
