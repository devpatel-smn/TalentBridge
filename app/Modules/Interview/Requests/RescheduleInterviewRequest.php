<?php

namespace App\Modules\Interview\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RescheduleInterviewRequest extends FormRequest
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
            'scheduled_at' => ['required', 'date', 'after:now'],
            'timezone' => ['sometimes', 'string', 'max:50', $this->timezoneRule()],
            'duration_minutes' => ['sometimes', 'integer', 'min:15', 'max:480'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'meeting_link' => ['sometimes', 'nullable', 'url', 'max:500'],
            'instructions' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'interviewer_user_uuids' => ['sometimes', 'array'],
            'interviewer_user_uuids.*' => ['uuid'],
        ];
    }

    /**
     * @return \Closure(string, mixed, \Closure): void
     */
    private function timezoneRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            if (! is_string($value) || ! in_array($value, timezone_identifiers_list(), true)) {
                $fail('The selected timezone is invalid.');
            }
        };
    }
}
