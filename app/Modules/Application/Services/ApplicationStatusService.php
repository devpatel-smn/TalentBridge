<?php

namespace App\Modules\Application\Services;

use App\Enums\ApplicationStatus;
use Illuminate\Validation\ValidationException;

class ApplicationStatusService
{
    /**
     * @return array<string, list<string>>
     */
    private function transitions(): array
    {
        return [
            ApplicationStatus::Submitted->value => [
                ApplicationStatus::UnderReview->value,
                ApplicationStatus::Shortlisted->value,
                ApplicationStatus::Rejected->value,
                ApplicationStatus::Withdrawn->value,
            ],
            ApplicationStatus::UnderReview->value => [
                ApplicationStatus::Shortlisted->value,
                ApplicationStatus::Offered->value,
                ApplicationStatus::Rejected->value,
                ApplicationStatus::Withdrawn->value,
            ],
            ApplicationStatus::Shortlisted->value => [
                ApplicationStatus::InterviewScheduled->value,
                ApplicationStatus::Offered->value,
                ApplicationStatus::Hired->value,
                ApplicationStatus::Rejected->value,
                ApplicationStatus::Withdrawn->value,
            ],
            ApplicationStatus::InterviewScheduled->value => [
                ApplicationStatus::Interviewed->value,
                ApplicationStatus::Offered->value,
                ApplicationStatus::Rejected->value,
                ApplicationStatus::Withdrawn->value,
            ],
            ApplicationStatus::Interviewed->value => [
                ApplicationStatus::Offered->value,
                ApplicationStatus::Hired->value,
                ApplicationStatus::Rejected->value,
                ApplicationStatus::Withdrawn->value,
            ],
            ApplicationStatus::Offered->value => [
                ApplicationStatus::Hired->value,
                ApplicationStatus::Rejected->value,
                ApplicationStatus::Withdrawn->value,
            ],
            ApplicationStatus::Rejected->value => [],
            ApplicationStatus::Withdrawn->value => [],
            ApplicationStatus::Hired->value => [],
        ];
    }

    public function assertTransitionAllowed(ApplicationStatus $from, ApplicationStatus $to): void
    {
        if ($from === $to) {
            throw ValidationException::withMessages([
                'status' => ['Application is already in the requested status.'],
            ]);
        }

        $allowed = $this->transitions()[$from->value] ?? [];

        if (! in_array($to->value, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => ["Cannot change application status from {$from->value} to {$to->value}."],
            ]);
        }
    }
}
