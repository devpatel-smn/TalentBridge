<?php

namespace App\Notifications;

use App\Models\Company;
use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamMemberAddedNotification extends Notification
{
    public function __construct(
        private readonly Company $company,
        private readonly User $inviter,
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

        return (new MailMessage)
            ->subject("You've been added to {$this->company->name} on TalentBridge")
            ->greeting("Hello {$notifiable->full_name}!")
            ->line("{$this->inviter->full_name} added you to {$this->company->name}'s hiring team on TalentBridge.")
            ->when($this->jobTitle, fn (MailMessage $message) => $message->line("Role: {$this->jobTitle}"))
            ->action('Open employer workspace', $frontendUrl.'/employer')
            ->line('Sign in with your existing TalentBridge account to start collaborating on hiring.');
    }
}
