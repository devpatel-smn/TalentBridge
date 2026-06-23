<?php

namespace App\Modules\Interview\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManageParticipantsRequest extends FormRequest
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
            'interviewer_user_uuids' => ['required', 'array', 'min:1'],
            'interviewer_user_uuids.*' => ['uuid'],
            'observer_user_uuids' => ['sometimes', 'array'],
            'observer_user_uuids.*' => ['uuid'],
        ];
    }
}
