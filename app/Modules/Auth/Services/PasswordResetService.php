<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PasswordResetService
{
    public function sendResetLink(string $email): string
    {
        return Password::sendResetLink(['email' => $email]);
    }

    /**
     * @param  array<string, mixed>  $credentials
     */
    public function resetPassword(array $credentials): string
    {
        return Password::reset(
            $credentials,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );
    }

    /**
     * @throws ValidationException
     */
    public function assertResetSucceeded(string $status): void
    {
        if ($status === Password::PASSWORD_RESET) {
            return;
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
