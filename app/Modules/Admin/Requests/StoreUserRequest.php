<?php

namespace App\Modules\Admin\Requests;

use App\Enums\UserStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', User::class) ?? false;
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
            'role' => ['required', 'string', Rule::in([Role::ADMIN, Role::EMPLOYER, Role::JOB_SEEKER])],
            'company_name' => [
                'required_if:role,'.Role::EMPLOYER,
                'nullable',
                'string',
                'max:255',
            ],
            'status' => ['sometimes', 'string', Rule::enum(UserStatus::class)],
            'timezone' => ['nullable', 'string', 'max:50'],
            'locale' => ['nullable', 'string', 'max:10'],
            'email_verified' => ['sometimes', 'boolean'],
        ];
    }
}
