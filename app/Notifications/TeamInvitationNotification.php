<?php

namespace App\Notifications;

use App\Models\Company;
use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInvitationNotification extends Notification
{
    public function __construct(
        private readonly Company $company,
        private readonly User $inviter,
        private readonly string $token,
        private readonly string $email,
        private readonly ?string $jobTitle = null,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim((string) config('talentbridge.frontend_url', config('app.url')), '/');
        $acceptUrl = $frontendUrl.'/accept-team-invite?token='.urlencode($this->token)
            .'&email='.urlencode($this->email);
        $expiryHours = (int) config('talentbridge.team_invitation.expire_hours', 72);

        return (new MailMessage)
            ->subject("You're invited to join {$this->company->name} on TalentBridge")
            ->greeting('Hello!')
            ->line("{$this->inviter->full_name} invited you to join {$this->company->name}'s hiring team on TalentBridge.")
            ->when($this->jobTitle, fn (MailMessage $message) => $message->line("Role: {$this->jobTitle}"))
            ->line('Click the button below to set your password and access your employer workspace.')
            ->action('Accept invitation', $acceptUrl)
            ->line("This invitation expires in {$expiryHours} hours.")
            ->line('If you were not expecting this invitation, you can ignore this email.');
    }
}
