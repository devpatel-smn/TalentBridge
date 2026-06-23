<?php

namespace App\Modules\Auth\Services;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\URL;

class EmailVerificationService
{
    public function sendVerificationNotification(User $user): void
    {
        if ($user->hasVerifiedEmail()) {
            return;
        }

        $user->sendEmailVerificationNotification();
    }

    public function verify(User $user, string $hash): bool
    {
        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return false;
        }

        if ($user->hasVerifiedEmail()) {
            return true;
        }

        if ($user->markEmailAsVerified()) {
            if ($user->status === UserStatus::PendingVerification) {
                $user->update(['status' => UserStatus::Active]);
            }

            event(new Verified($user));
        }

        return true;
    }

    public function verificationUrl(User $user): string
    {
        return URL::temporarySignedRoute(
            'api.v1.auth.email.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );
    }
}
