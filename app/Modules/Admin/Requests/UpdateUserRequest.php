<?php

namespace App\Modules\Admin\Requests;

use App\Enums\UserStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $target */
        $target = $this->route('user');

        return $target && $this->user()?->can('update', $target);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var User $target */
        $target = $this->route('user');
        $minLength = config('talentbridge.security.password_min_length', 8);

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($target->id)],
            'password' => [
                'sometimes',
                'string',
                'confirmed',
                Password::min($minLength)->mixedCase()->numbers()->symbols(),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['sometimes', 'string', Rule::in([Role::ADMIN, Role::EMPLOYER, Role::JOB_SEEKER])],
            'status' => ['sometimes', 'string', Rule::enum(UserStatus::class)],
            'timezone' => ['nullable', 'string', 'max:50'],
            'locale' => ['nullable', 'string', 'max:10'],
        ];
    }
}
