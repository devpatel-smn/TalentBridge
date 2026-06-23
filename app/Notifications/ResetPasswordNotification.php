<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPasswordNotification
{
    public function toMail($notifiable): MailMessage
    {
        $frontendUrl = rtrim((string) config('talentbridge.frontend_url'), '/');
        $url = $frontendUrl.'/reset-password?token='.$this->token
            .'&email='.urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $url)
            ->line('This password reset link will expire in '
                .config('auth.passwords.users.expire').' minutes.')
            ->line('If you did not request a password reset, no further action is required.');
    }
}
