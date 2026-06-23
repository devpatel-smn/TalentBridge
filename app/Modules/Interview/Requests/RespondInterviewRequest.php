<?php

namespace App\Modules\Interview\Requests;

use App\Models\InterviewParticipant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RespondInterviewRequest extends FormRequest
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
            'response' => ['required', Rule::in([
                InterviewParticipant::RESPONSE_ACCEPTED,
                InterviewParticipant::RESPONSE_DECLINED,
            ])],
        ];
    }
}
