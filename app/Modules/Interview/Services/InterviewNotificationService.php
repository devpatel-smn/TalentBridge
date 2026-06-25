<?php

namespace App\Modules\Interview\Services;

use App\Models\Interview;
use App\Models\InterviewParticipant;
use App\Models\User;
use App\Modules\Notification\Notifications\InterviewCancelledNotification;
use App\Modules\Notification\Notifications\InterviewRescheduledNotification;
use App\Modules\Notification\Notifications\InterviewScheduledNotification;
use App\Modules\Notification\Services\NotificationService;
use Illuminate\Support\Collection;

class InterviewNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function notifyScheduled(Interview $interview): void
    {
        $interview = $this->loadRelations($interview);
        $formattedAt = $this->formatScheduledAt($interview);

        foreach ($this->resolveRecipients($interview) as $recipient) {
            $this->notificationService->dispatch(
                $recipient['user'],
                InterviewScheduledNotification::createForInterview(
                    $interview,
                    $formattedAt,
                    $recipient['role_context'],
                ),
            );
        }
    }

    public function notifyRescheduled(Interview $interview): void
    {
        $interview = $this->loadRelations($interview);
        $formattedAt = $this->formatScheduledAt($interview);

        foreach ($this->resolveRecipients($interview) as $recipient) {
            $this->notificationService->dispatch(
                $recipient['user'],
                InterviewRescheduledNotification::createForInterview(
                    $interview,
                    $formattedAt,
                    $recipient['role_context'],
                ),
            );
        }
    }

    public function notifyCancelled(Interview $interview, ?string $reason = null): void
    {
        $interview = $this->loadRelations($interview);

        foreach ($this->resolveRecipients($interview) as $recipient) {
            $this->notificationService->dispatch(
                $recipient['user'],
                InterviewCancelledNotification::createForInterview(
                    $interview,
                    $recipient['role_context'],
                    $reason ?? $interview->cancellation_reason,
                ),
            );
        }
    }

    private function loadRelations(Interview $interview): Interview
    {
        return $interview->loadMissing([
            'company',
            'jobApplication.job',
            'jobApplication.jobSeekerProfile.user',
            'participants.user',
            'scheduler',
        ]);
    }

    private function formatScheduledAt(Interview $interview): string
    {
        return $interview->scheduled_at
            ->timezone($interview->timezone)
            ->format('M j, Y g:i A T');
    }

    /**
     * @return list<array{user: User, role_context: string}>
     */
    private function resolveRecipients(Interview $interview): array
    {
        /** @var Collection<int, User> $users */
        $users = collect();

        $candidate = $interview->jobApplication?->jobSeekerProfile?->user;
        if ($candidate instanceof User) {
            $users->put($candidate->id, $candidate);
        }

        if ($interview->scheduler instanceof User) {
            $users->put($interview->scheduler->id, $interview->scheduler);
        }

        $interview->participants
            ->filter(fn (InterviewParticipant $participant) => in_array($participant->role, [
                InterviewParticipant::ROLE_INTERVIEWER,
                InterviewParticipant::ROLE_OBSERVER,
            ], true))
            ->each(function (InterviewParticipant $participant) use ($users): void {
                if ($participant->user instanceof User) {
                    $users->put($participant->user->id, $participant->user);
                }
            });

        return $users->values()->map(function (User $user) {
            return [
                'user' => $user,
                'role_context' => $user->isJobSeeker() ? 'job-seeker' : 'employer',
            ];
        })->all();
    }
}
