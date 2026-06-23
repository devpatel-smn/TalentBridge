<?php

namespace App\Modules\Auth\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
        $minLength = config('talentbridge.security.password_min_length', 8);

        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min($minLength)->mixedCase()->numbers()->symbols(),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'string', Rule::in(Role::registrable())],
            'company_name' => [
                'required_if:role,'.Role::EMPLOYER,
                'nullable',
                'string',
                'max:255',
            ],
            'timezone' => ['nullable', 'string', 'max:50'],
            'locale' => ['nullable', 'string', 'max:10'],
        ];
    }
}
