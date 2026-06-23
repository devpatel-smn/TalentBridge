<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $minLength = config('talentbridge.security.password_min_length', 8);

        return [
            'current_password' => ['required', 'string'],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min($minLength)->mixedCase()->numbers()->symbols(),
            ],
        ];
    }
}
