<?php

namespace App\Modules\Interview\Services;

use App\Enums\InterviewStatus;
use Illuminate\Validation\ValidationException;

class InterviewStatusService
{
    /**
     * @return array<string, list<string>>
     */
    private function transitions(): array
    {
        return [
            InterviewStatus::Scheduled->value => [
                InterviewStatus::Confirmed->value,
                InterviewStatus::Completed->value,
                InterviewStatus::Cancelled->value,
                InterviewStatus::NoShow->value,
            ],
            InterviewStatus::Confirmed->value => [
                InterviewStatus::Completed->value,
                InterviewStatus::Cancelled->value,
                InterviewStatus::NoShow->value,
            ],
            InterviewStatus::Rescheduled->value => [
                InterviewStatus::Scheduled->value,
                InterviewStatus::Cancelled->value,
            ],
            InterviewStatus::Completed->value => [],
            InterviewStatus::Cancelled->value => [],
            InterviewStatus::NoShow->value => [],
        ];
    }

    /**
     * @return list<InterviewStatus>
     */
    public function rescheduleableStatuses(): array
    {
        return [
            InterviewStatus::Scheduled,
            InterviewStatus::Confirmed,
            InterviewStatus::Rescheduled,
        ];
    }

    /**
     * @return list<InterviewStatus>
     */
    public function cancellableStatuses(): array
    {
        return [
            InterviewStatus::Scheduled,
            InterviewStatus::Confirmed,
            InterviewStatus::Rescheduled,
        ];
    }

    /**
     * @return list<InterviewStatus>
     */
    public function completableStatuses(): array
    {
        return [
            InterviewStatus::Scheduled,
            InterviewStatus::Confirmed,
        ];
    }

    public function assertTransitionAllowed(InterviewStatus $from, InterviewStatus $to): void
    {
        if ($from === $to) {
            throw ValidationException::withMessages([
                'status' => ['Interview is already in the requested status.'],
            ]);
        }

        $allowed = $this->transitions()[$from->value] ?? [];

        if (! in_array($to->value, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => ["Cannot change interview status from {$from->value} to {$to->value}."],
            ]);
        }
    }

    public function assertReschedulable(InterviewStatus $status): void
    {
        if (! in_array($status, $this->rescheduleableStatuses(), true)) {
            throw ValidationException::withMessages([
                'interview' => ['This interview cannot be rescheduled in its current status.'],
            ]);
        }
    }

    public function assertCancellable(InterviewStatus $status): void
    {
        if (! in_array($status, $this->cancellableStatuses(), true)) {
            throw ValidationException::withMessages([
                'interview' => ['This interview cannot be cancelled in its current status.'],
            ]);
        }
    }

    public function assertCompletable(InterviewStatus $status): void
    {
        if (! in_array($status, $this->completableStatuses(), true)) {
            throw ValidationException::withMessages([
                'interview' => ['This interview cannot be completed in its current status.'],
            ]);
        }
    }
}
