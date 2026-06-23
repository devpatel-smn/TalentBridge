<?php

namespace App\Modules\Notification\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SendSystemNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
            'action_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'target_role' => [
                'required',
                'string',
                Rule::in([Role::ADMIN, Role::EMPLOYER, Role::JOB_SEEKER, 'all']),
            ],
        ];
    }
}
