<?php

namespace App\Modules\Notification\Requests;

use App\Enums\NotificationType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNotificationPreferencesRequest extends FormRequest
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
            'preferences' => ['required', 'array', 'min:1'],
            'preferences.*.notification_type' => [
                'required',
                'string',
                Rule::enum(NotificationType::class),
            ],
            'preferences.*.channel_mail' => ['sometimes', 'boolean'],
            'preferences.*.channel_database' => ['sometimes', 'boolean'],
        ];
    }
}
