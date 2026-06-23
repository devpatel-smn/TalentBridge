<?php

namespace App\Modules\Admin\Requests;

use App\Models\SystemSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', SystemSetting::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'settings' => ['required', 'array', 'min:1'],
            'settings.*.key' => ['required', 'string', 'max:100'],
            'settings.*.value' => ['required', 'array'],
            'settings.*.group' => [
                'sometimes',
                'string',
                Rule::in([
                    SystemSetting::GROUP_GENERAL,
                    SystemSetting::GROUP_EMAIL,
                    SystemSetting::GROUP_SECURITY,
                ]),
            ],
            'settings.*.description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
