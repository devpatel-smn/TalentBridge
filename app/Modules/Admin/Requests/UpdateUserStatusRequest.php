<?php

namespace App\Modules\Admin\Requests;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $target */
        $target = $this->route('user');

        return $target && $this->user()?->can('suspend', $target);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::enum(UserStatus::class)],
        ];
    }
}
