<?php

namespace App\Modules\Interview\Requests;

use App\Enums\InterviewType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ScheduleInterviewRequest extends FormRequest
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
            'application_uuid' => ['required', 'uuid'],
            'interview_type' => ['required', Rule::enum(InterviewType::class)],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['sometimes', 'integer', 'min:15', 'max:480'],
            'timezone' => ['required', 'string', 'max:50', $this->timezoneRule()],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'meeting_link' => ['sometimes', 'nullable', 'url', 'max:500'],
            'instructions' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'interviewer_user_uuids' => ['sometimes', 'array'],
            'interviewer_user_uuids.*' => ['uuid'],
            'observer_user_uuids' => ['sometimes', 'array'],
            'observer_user_uuids.*' => ['uuid'],
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
