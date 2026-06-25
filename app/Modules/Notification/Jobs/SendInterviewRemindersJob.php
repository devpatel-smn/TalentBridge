<?php

namespace App\Modules\Notification\Jobs;

use App\Enums\InterviewStatus;
use App\Models\Interview;
use App\Models\InterviewParticipant;
use App\Models\User;
use App\Modules\Notification\Notifications\InterviewReminderNotification;
use App\Modules\Notification\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class SendInterviewRemindersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct()
    {
        $this->onQueue('notifications');
    }

    public function handle(NotificationService $notificationService): void
    {
        $this->sendReminders($notificationService, now()->addDay(), '24 hours');
        $this->sendReminders($notificationService, now()->addHour(), '1 hour');
    }

    private function sendReminders(
        NotificationService $notificationService,
        Carbon $targetTime,
        string $reminderLabel,
    ): void {
        $windowStart = $targetTime->copy()->subMinutes(30);
        $windowEnd = $targetTime->copy()->addMinutes(30);

        Interview::query()
            ->with([
                'jobApplication.jobSeekerProfile.user',
                'participants.user',
            ])
            ->whereIn('status', [
                InterviewStatus::Scheduled,
                InterviewStatus::Confirmed,
                InterviewStatus::Rescheduled,
            ])
            ->whereBetween('scheduled_at', [$windowStart, $windowEnd])
            ->each(function (Interview $interview) use ($notificationService, $reminderLabel): void {
                $title = $interview->title ?? 'Interview';
                $scheduledAt = $interview->scheduled_at
                    ->timezone($interview->timezone)
                    ->format('M j, Y g:i A T');

                $candidate = $interview->jobApplication?->jobSeekerProfile?->user;
                $candidateId = $candidate?->id;

                if ($candidate instanceof User) {
                    $notificationService->dispatch(
                        $candidate,
                        InterviewReminderNotification::create(
                            $title,
                            $scheduledAt,
                            $interview->uuid,
                            'job-seeker',
                            $reminderLabel,
                        ),
                    );
                }

                $interview->participants
                    ->each(function (InterviewParticipant $participant) use (
                        $notificationService,
                        $title,
                        $scheduledAt,
                        $interview,
                        $reminderLabel,
                        $candidateId,
                    ): void {
                        $user = $participant->user;

                        if (! $user instanceof User || $user->id === $candidateId) {
                            return;
                        }

                        $roleContext = $user->isEmployer() ? 'employer' : 'job-seeker';

                        $notificationService->dispatch(
                            $user,
                            InterviewReminderNotification::create(
                                $title,
                                $scheduledAt,
                                $interview->uuid,
                                $roleContext,
                                $reminderLabel,
                            ),
                        );
                    });
            });
    }
}
