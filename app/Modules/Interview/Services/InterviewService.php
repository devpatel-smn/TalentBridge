<?php

namespace App\Modules\Interview\Services;

use App\Enums\ApplicationStatus;
use App\Enums\AuditAction;
use App\Enums\InterviewStatus;
use App\Enums\InterviewType;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\Interview;
use App\Models\InterviewParticipant;
use App\Models\JobApplication;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Application\Repositories\Contracts\JobApplicationRepositoryInterface;
use App\Modules\Application\Services\ApplicationStatusService;
use App\Modules\Interview\Repositories\Contracts\InterviewRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InterviewService
{
    /**
     * @var list<ApplicationStatus>
     */
    private const SCHEDULABLE_STATUSES = [
        ApplicationStatus::Shortlisted,
        ApplicationStatus::Offered,
        ApplicationStatus::InterviewScheduled,
        ApplicationStatus::Interviewed,
    ];

    public function __construct(
        private readonly InterviewRepositoryInterface $interviews,
        private readonly JobApplicationRepositoryInterface $applications,
        private readonly InterviewStatusService $statusService,
        private readonly ApplicationStatusService $applicationStatusService,
        private readonly InterviewNotificationService $interviewNotifications,
    ) {}

    public function listForCompany(int $companyId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->interviews->paginateForCompany($companyId, $params);
    }

    public function listUpcomingForCompany(int $companyId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->interviews->paginateForCompany($companyId, $params, upcomingOnly: true);
    }

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->interviews->paginateForProfile($profileId, $params);
    }

    public function listUpcomingForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->interviews->paginateForProfile($profileId, $params, upcomingOnly: true);
    }

    public function findForCompany(int $companyId, string $uuid): Interview
    {
        return $this->interviews->findByUuid($uuid, companyId: $companyId)
            ?? throw ValidationException::withMessages(['interview' => ['Interview not found.']]);
    }

    public function findForProfile(int $profileId, string $uuid): Interview
    {
        return $this->interviews->findByUuid($uuid, profileId: $profileId)
            ?? throw ValidationException::withMessages(['interview' => ['Interview not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function schedule(int $companyId, array $data, User $actor, Request $request): Interview
    {
        $application = $this->interviews->findApplicationForCompany($data['application_uuid'], $companyId)
            ?? throw ValidationException::withMessages(['application_uuid' => ['Application not found.']]);

        $this->assertApplicationSchedulable($application);

        $durationMinutes = (int) ($data['duration_minutes'] ?? 60);
        $this->assertNoSchedulingConflict($application->id, $data['scheduled_at'], $durationMinutes);

        return DB::transaction(function () use ($companyId, $data, $actor, $request, $application) {
            $interview = $this->interviews->create([
                'job_application_id' => $application->id,
                'company_id' => $companyId,
                'scheduled_by' => $actor->id,
                'interview_type' => InterviewType::from($data['interview_type']),
                'status' => InterviewStatus::Scheduled,
                'title' => $data['title'] ?? null,
                'scheduled_at' => $data['scheduled_at'],
                'duration_minutes' => $data['duration_minutes'] ?? 60,
                'timezone' => $data['timezone'],
                'location' => $data['location'] ?? null,
                'meeting_link' => $data['meeting_link'] ?? null,
                'instructions' => $data['instructions'] ?? null,
            ]);

            $this->recordStatusHistory(
                $interview,
                null,
                InterviewStatus::Scheduled,
                $actor->id,
                'Interview scheduled.'
            );

            $this->syncParticipants($interview, $application, $data, $actor);

            $this->maybeAdvanceApplicationStatus($application, $actor, $request);

            $this->logAudit($interview, AuditAction::Created, $actor, $request, null, [
                'status' => InterviewStatus::Scheduled->value,
                'application_uuid' => $application->uuid,
                'scheduled_at' => $interview->scheduled_at?->toIso8601String(),
            ]);
            $this->logActivity(
                $actor,
                $companyId,
                'interview.scheduled',
                "Interview scheduled for application {$application->uuid}.",
                $interview,
                ['interview_uuid' => $interview->uuid, 'application_uuid' => $application->uuid]
            );

            $fresh = $interview->fresh([
                'company',
                'jobApplication.job',
                'jobApplication.jobSeekerProfile.user',
                'participants.user',
                'scheduler',
                'statusHistories.changedByUser',
            ]);

            $this->interviewNotifications->notifyScheduled($fresh);

            return $fresh;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function reschedule(Interview $interview, array $data, User $actor, Request $request): Interview
    {
        $this->statusService->assertReschedulable($interview->status);

        $durationMinutes = (int) ($data['duration_minutes'] ?? $interview->duration_minutes);
        $this->assertNoSchedulingConflict(
            $interview->job_application_id,
            $data['scheduled_at'],
            $durationMinutes,
            $interview->id,
        );

        return DB::transaction(function () use ($interview, $data, $actor, $request) {
            $fromStatus = $interview->status;
            $oldValues = [
                'scheduled_at' => $interview->scheduled_at?->toIso8601String(),
                'timezone' => $interview->timezone,
                'status' => $interview->status->value,
            ];

            $this->recordStatusHistory(
                $interview,
                $fromStatus,
                InterviewStatus::Rescheduled,
                $actor->id,
                $data['notes'] ?? 'Interview rescheduled.'
            );

            $attributes = [
                'scheduled_at' => $data['scheduled_at'],
                'timezone' => $data['timezone'] ?? $interview->timezone,
                'status' => InterviewStatus::Scheduled,
            ];

            foreach (['duration_minutes', 'location', 'meeting_link', 'instructions', 'title'] as $field) {
                if (array_key_exists($field, $data)) {
                    $attributes[$field] = $data[$field];
                }
            }

            $updated = $this->interviews->update($interview, $attributes);

            $this->recordStatusHistory(
                $updated,
                InterviewStatus::Rescheduled,
                InterviewStatus::Scheduled,
                $actor->id,
                'Rescheduled interview confirmed.'
            );

            if (! empty($data['interviewer_user_uuids'])) {
                $this->replaceInterviewers($updated, $data['interviewer_user_uuids'], $actor);
            }

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'scheduled_at' => $updated->scheduled_at?->toIso8601String(),
                'timezone' => $updated->timezone,
                'status' => $updated->status->value,
            ]);
            $this->logActivity(
                $actor,
                $updated->company_id,
                'interview.rescheduled',
                "Interview {$updated->uuid} rescheduled.",
                $updated,
                ['interview_uuid' => $updated->uuid]
            );

            $fresh = $updated->load([
                'company',
                'jobApplication.job',
                'jobApplication.jobSeekerProfile.user',
                'participants.user',
                'scheduler',
                'statusHistories.changedByUser',
            ]);

            $this->interviewNotifications->notifyRescheduled($fresh);

            return $fresh;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function cancel(Interview $interview, array $data, User $actor, Request $request): Interview
    {
        $this->statusService->assertCancellable($interview->status);

        return DB::transaction(function () use ($interview, $data, $actor, $request) {
            $fromStatus = $interview->status;
            $oldValues = [
                'status' => $interview->status->value,
                'cancelled_at' => $interview->cancelled_at?->toIso8601String(),
            ];

            $updated = $this->interviews->update($interview, [
                'status' => InterviewStatus::Cancelled,
                'cancelled_at' => now(),
                'cancellation_reason' => $data['cancellation_reason'] ?? null,
            ]);

            $this->recordStatusHistory(
                $updated,
                $fromStatus,
                InterviewStatus::Cancelled,
                $actor->id,
                $data['cancellation_reason'] ?? 'Interview cancelled.'
            );

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'status' => InterviewStatus::Cancelled->value,
                'cancellation_reason' => $updated->cancellation_reason,
            ]);
            $this->logActivity(
                $actor,
                $updated->company_id,
                'interview.cancelled',
                "Interview {$updated->uuid} cancelled.",
                $updated,
                ['interview_uuid' => $updated->uuid]
            );

            $fresh = $updated->load([
                'company',
                'jobApplication.job',
                'jobApplication.jobSeekerProfile.user',
                'participants.user',
                'scheduler',
                'statusHistories.changedByUser',
            ]);

            $this->interviewNotifications->notifyCancelled(
                $fresh,
                $data['cancellation_reason'] ?? null,
            );

            return $fresh;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function complete(Interview $interview, array $data, User $actor, Request $request): Interview
    {
        $this->statusService->assertCompletable($interview->status);

        return DB::transaction(function () use ($interview, $data, $actor, $request) {
            $fromStatus = $interview->status;
            $oldValues = [
                'status' => $interview->status->value,
                'feedback' => $interview->feedback,
                'rating' => $interview->rating,
            ];

            $updated = $this->interviews->update($interview, [
                'status' => InterviewStatus::Completed,
                'completed_at' => now(),
                'feedback' => $data['feedback'] ?? $interview->feedback,
                'rating' => $data['rating'] ?? $interview->rating,
            ]);

            $this->recordStatusHistory(
                $updated,
                $fromStatus,
                InterviewStatus::Completed,
                $actor->id,
                $data['notes'] ?? 'Interview marked as completed.'
            );

            $this->maybeMarkApplicationInterviewed($updated->jobApplication, $actor, $request);

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'status' => InterviewStatus::Completed->value,
                'feedback' => $updated->feedback,
                'rating' => $updated->rating,
            ]);
            $this->logActivity(
                $actor,
                $updated->company_id,
                'interview.completed',
                "Interview {$updated->uuid} completed.",
                $updated,
                ['interview_uuid' => $updated->uuid]
            );

            return $updated->load(['statusHistories.changedByUser']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateStatus(Interview $interview, array $data, User $actor, Request $request): Interview
    {
        $toStatus = InterviewStatus::from($data['status']);
        $this->statusService->assertTransitionAllowed($interview->status, $toStatus);

        return DB::transaction(function () use ($interview, $data, $actor, $request, $toStatus) {
            $fromStatus = $interview->status;
            $attributes = ['status' => $toStatus];

            if ($toStatus === InterviewStatus::Cancelled) {
                $attributes['cancelled_at'] = now();
                $attributes['cancellation_reason'] = $data['cancellation_reason'] ?? null;
            }

            if ($toStatus === InterviewStatus::Completed) {
                $attributes['completed_at'] = now();
            }

            $updated = $this->interviews->update($interview, $attributes);

            $this->recordStatusHistory(
                $updated,
                $fromStatus,
                $toStatus,
                $actor->id,
                $data['notes'] ?? "Interview status changed to {$toStatus->value}."
            );

            if ($toStatus === InterviewStatus::Completed) {
                $this->maybeMarkApplicationInterviewed($updated->jobApplication, $actor, $request);
            }

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, [
                'status' => $fromStatus->value,
            ], [
                'status' => $toStatus->value,
            ]);
            $this->logActivity(
                $actor,
                $updated->company_id,
                'interview.status_updated',
                "Interview {$updated->uuid} status changed to {$toStatus->value}.",
                $updated,
                ['interview_uuid' => $updated->uuid, 'from_status' => $fromStatus->value, 'to_status' => $toStatus->value]
            );

            return $updated->load(['statusHistories.changedByUser']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateNotes(Interview $interview, array $data, User $actor, Request $request): Interview
    {
        return DB::transaction(function () use ($interview, $data, $actor, $request) {
            $oldValues = ['instructions' => $interview->instructions];

            $updated = $this->interviews->update($interview, [
                'instructions' => $data['instructions'] ?? null,
            ]);

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'instructions' => $updated->instructions,
            ]);
            $this->logActivity(
                $actor,
                $updated->company_id,
                'interview.notes_updated',
                "Interview notes updated for {$updated->uuid}.",
                $updated,
                ['interview_uuid' => $updated->uuid]
            );

            return $updated;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function submitFeedback(Interview $interview, array $data, User $actor, Request $request): Interview
    {
        if (! in_array($interview->status, [InterviewStatus::Completed, InterviewStatus::Scheduled, InterviewStatus::Confirmed], true)) {
            throw ValidationException::withMessages([
                'interview' => ['Feedback can only be submitted for active or completed interviews.'],
            ]);
        }

        return DB::transaction(function () use ($interview, $data, $actor, $request) {
            $oldValues = [
                'feedback' => $interview->feedback,
                'rating' => $interview->rating,
            ];

            $updated = $this->interviews->update($interview, [
                'feedback' => $data['feedback'] ?? null,
                'rating' => $data['rating'] ?? null,
            ]);

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'feedback' => $updated->feedback,
                'rating' => $updated->rating,
            ]);
            $this->logActivity(
                $actor,
                $updated->company_id,
                'interview.feedback_submitted',
                "Interview feedback submitted for {$updated->uuid}.",
                $updated,
                ['interview_uuid' => $updated->uuid]
            );

            return $updated;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function manageParticipants(Interview $interview, array $data, User $actor, Request $request): Interview
    {
        if (in_array($interview->status, [InterviewStatus::Cancelled, InterviewStatus::Completed], true)) {
            throw ValidationException::withMessages([
                'interview' => ['Participants cannot be modified for closed interviews.'],
            ]);
        }

        return DB::transaction(function () use ($interview, $data, $actor, $request) {
            $this->replaceInterviewers($interview, $data['interviewer_user_uuids'] ?? [], $actor);

            if (! empty($data['observer_user_uuids'])) {
                $this->replaceObservers($interview, $data['observer_user_uuids'], $actor);
            }

            $updated = $interview->fresh([
                'company',
                'jobApplication.job',
                'jobApplication.jobSeekerProfile.user',
                'participants.user',
                'scheduler',
            ]);

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, null, [
                'participants' => $updated->participants->map(fn ($participant) => [
                    'user_id' => $participant->user_id,
                    'role' => $participant->role,
                ])->values()->all(),
            ]);
            $this->logActivity(
                $actor,
                $updated->company_id,
                'interview.participants_updated',
                "Interview participants updated for {$updated->uuid}.",
                $updated,
                ['interview_uuid' => $updated->uuid]
            );

            return $updated;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function respond(Interview $interview, User $actor, array $data, Request $request): Interview
    {
        $participant = InterviewParticipant::query()
            ->where('interview_id', $interview->id)
            ->where('user_id', $actor->id)
            ->where('role', InterviewParticipant::ROLE_CANDIDATE)
            ->first();

        if (! $participant) {
            throw ValidationException::withMessages([
                'interview' => ['You are not a participant in this interview.'],
            ]);
        }

        if (! in_array($interview->status, [InterviewStatus::Scheduled, InterviewStatus::Rescheduled, InterviewStatus::Confirmed], true)) {
            throw ValidationException::withMessages([
                'interview' => ['This interview can no longer be accepted or declined.'],
            ]);
        }

        if ($participant->response_status !== InterviewParticipant::RESPONSE_PENDING) {
            throw ValidationException::withMessages([
                'response' => ['You have already responded to this interview.'],
            ]);
        }

        $response = $data['response'];

        return DB::transaction(function () use ($interview, $participant, $response, $actor, $request) {
            $participant->update(['response_status' => $response]);

            if ($response === InterviewParticipant::RESPONSE_ACCEPTED
                && in_array($interview->status, [InterviewStatus::Scheduled, InterviewStatus::Rescheduled], true)) {
                $fromStatus = $interview->status;
                $interview = $this->interviews->update($interview, [
                    'status' => InterviewStatus::Confirmed,
                ]);

                $this->recordStatusHistory(
                    $interview,
                    $fromStatus,
                    InterviewStatus::Confirmed,
                    $actor->id,
                    'Candidate accepted the interview invitation.'
                );
            }

            $this->logAudit($interview, AuditAction::Updated, $actor, $request, null, [
                'response' => $response,
            ]);
            $this->logActivity(
                $actor,
                $interview->company_id,
                'interview.response_recorded',
                "Candidate {$response} interview {$interview->uuid}.",
                $interview,
                ['interview_uuid' => $interview->uuid, 'response' => $response]
            );

            return $interview->fresh([
                'company',
                'jobApplication.job',
                'participants.user',
                'statusHistories.changedByUser',
            ]);
        });
    }

    public function delete(Interview $interview, User $actor, Request $request): void
    {
        if (! in_array($interview->status, [InterviewStatus::Cancelled, InterviewStatus::Completed], true)) {
            throw ValidationException::withMessages([
                'interview' => ['Only cancelled or completed interviews can be deleted.'],
            ]);
        }

        DB::transaction(function () use ($interview, $actor, $request) {
            $this->logAudit($interview, AuditAction::Deleted, $actor, $request, [
                'status' => $interview->status->value,
            ], null);
            $this->logActivity(
                $actor,
                $interview->company_id,
                'interview.deleted',
                "Interview {$interview->uuid} deleted.",
                $interview,
                ['interview_uuid' => $interview->uuid]
            );

            $interview->delete();
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function timeline(Interview $interview): array
    {
        $histories = $this->interviews->getStatusHistories($interview->id);

        $events = $histories->map(fn ($history) => [
            'type' => 'status_change',
            'from_status' => $history->from_status?->value,
            'to_status' => $history->to_status->value,
            'notes' => $history->notes,
            'changed_by' => $history->changedByUser ? [
                'uuid' => $history->changedByUser->uuid,
                'full_name' => $history->changedByUser->full_name,
            ] : null,
            'occurred_at' => $history->created_at->toIso8601String(),
        ])->values()->all();

        if ($interview->completed_at) {
            $events[] = [
                'type' => 'milestone',
                'milestone' => 'completed',
                'occurred_at' => $interview->completed_at->toIso8601String(),
            ];
        }

        if ($interview->cancelled_at) {
            $events[] = [
                'type' => 'milestone',
                'milestone' => 'cancelled',
                'occurred_at' => $interview->cancelled_at->toIso8601String(),
            ];
        }

        usort($events, fn (array $a, array $b) => strcmp($a['occurred_at'], $b['occurred_at']));

        return [
            'interview_uuid' => $interview->uuid,
            'current_status' => $interview->status->value,
            'events' => $events,
        ];
    }

    private function assertApplicationSchedulable(JobApplication $application): void
    {
        if (! in_array($application->status, self::SCHEDULABLE_STATUSES, true)) {
            throw ValidationException::withMessages([
                'application_uuid' => ['Only shortlisted or selected candidates can be scheduled for interviews.'],
            ]);
        }
    }

    private function assertNoSchedulingConflict(
        int $jobApplicationId,
        string $scheduledAt,
        int $durationMinutes,
        ?int $excludeInterviewId = null,
    ): void {
        if ($this->interviews->hasActiveSchedulingConflict(
            $jobApplicationId,
            $scheduledAt,
            $durationMinutes,
            $excludeInterviewId,
        )) {
            throw ValidationException::withMessages([
                'scheduled_at' => ['An active interview already exists at this date and time for this candidate.'],
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function syncParticipants(Interview $interview, JobApplication $application, array $data, User $actor): void
    {
        $candidateUserId = $application->jobSeekerProfile?->user_id;

        if ($candidateUserId) {
            $this->interviews->createParticipant([
                'interview_id' => $interview->id,
                'user_id' => $candidateUserId,
                'role' => InterviewParticipant::ROLE_CANDIDATE,
                'response_status' => InterviewParticipant::RESPONSE_PENDING,
            ]);
        }

        $interviewerUuids = $data['interviewer_user_uuids'] ?? [];
        if ($interviewerUuids !== []) {
            $this->replaceInterviewers($interview, $interviewerUuids, $actor);
        } else {
            $this->interviews->createParticipant([
                'interview_id' => $interview->id,
                'user_id' => $actor->id,
                'role' => InterviewParticipant::ROLE_INTERVIEWER,
                'response_status' => InterviewParticipant::RESPONSE_ACCEPTED,
            ]);
        }

        if (! empty($data['observer_user_uuids'])) {
            $this->replaceObservers($interview, $data['observer_user_uuids'], $actor);
        }
    }

    /**
     * @param  list<string>  $userUuids
     */
    private function replaceInterviewers(Interview $interview, array $userUuids, User $actor): void
    {
        $userIds = $this->resolveCompanyUserIds($interview->company_id, $userUuids);

        if ($userIds === [] && $userUuids !== []) {
            throw ValidationException::withMessages([
                'interviewer_user_uuids' => ['One or more interviewers are not active members of this company.'],
            ]);
        }

        InterviewParticipant::query()
            ->where('interview_id', $interview->id)
            ->where('role', InterviewParticipant::ROLE_INTERVIEWER)
            ->delete();

        $assigned = false;
        foreach ($userIds as $userId) {
            $this->interviews->createParticipant([
                'interview_id' => $interview->id,
                'user_id' => $userId,
                'role' => InterviewParticipant::ROLE_INTERVIEWER,
                'response_status' => InterviewParticipant::RESPONSE_ACCEPTED,
            ]);
            $assigned = true;
        }

        if (! $assigned) {
            $this->interviews->createParticipant([
                'interview_id' => $interview->id,
                'user_id' => $actor->id,
                'role' => InterviewParticipant::ROLE_INTERVIEWER,
                'response_status' => InterviewParticipant::RESPONSE_ACCEPTED,
            ]);
        }
    }

    /**
     * @param  list<string>  $userUuids
     */
    private function replaceObservers(Interview $interview, array $userUuids, User $actor): void
    {
        $userIds = $this->resolveCompanyUserIds($interview->company_id, $userUuids);

        InterviewParticipant::query()
            ->where('interview_id', $interview->id)
            ->where('role', InterviewParticipant::ROLE_OBSERVER)
            ->delete();

        foreach ($userIds as $userId) {
            $this->interviews->createParticipant([
                'interview_id' => $interview->id,
                'user_id' => $userId,
                'role' => InterviewParticipant::ROLE_OBSERVER,
                'response_status' => InterviewParticipant::RESPONSE_ACCEPTED,
            ]);
        }
    }

    /**
     * @param  list<string>  $userUuids
     * @return list<int>
     */
    private function resolveCompanyUserIds(int $companyId, array $userUuids): array
    {
        if ($userUuids === []) {
            return [];
        }

        $userIds = User::query()
            ->whereIn('uuid', $userUuids)
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        return $this->interviews->filterCompanyMemberUserIds($companyId, $userIds);
    }

    private function maybeAdvanceApplicationStatus(JobApplication $application, User $actor, Request $request): void
    {
        if (! in_array($application->status, [ApplicationStatus::Shortlisted, ApplicationStatus::Offered], true)) {
            return;
        }

        $fromStatus = $application->status;
        $this->applicationStatusService->assertTransitionAllowed($fromStatus, ApplicationStatus::InterviewScheduled);

        $updated = $this->applications->update($application, [
            'status' => ApplicationStatus::InterviewScheduled,
            'status_changed_at' => now(),
        ]);

        $this->applications->createStatusHistory([
            'job_application_id' => $updated->id,
            'from_status' => $fromStatus,
            'to_status' => ApplicationStatus::InterviewScheduled,
            'changed_by' => $actor->id,
            'notes' => 'Interview scheduled.',
            'created_at' => now(),
        ]);
    }

    private function maybeMarkApplicationInterviewed(?JobApplication $application, User $actor, Request $request): void
    {
        if (! $application || $application->status !== ApplicationStatus::InterviewScheduled) {
            return;
        }

        $fromStatus = $application->status;
        $this->applicationStatusService->assertTransitionAllowed($fromStatus, ApplicationStatus::Interviewed);

        $updated = $this->applications->update($application, [
            'status' => ApplicationStatus::Interviewed,
            'status_changed_at' => now(),
        ]);

        $this->applications->createStatusHistory([
            'job_application_id' => $updated->id,
            'from_status' => $fromStatus,
            'to_status' => ApplicationStatus::Interviewed,
            'changed_by' => $actor->id,
            'notes' => 'Interview completed.',
            'created_at' => now(),
        ]);
    }

    private function recordStatusHistory(
        Interview $interview,
        ?InterviewStatus $fromStatus,
        InterviewStatus $toStatus,
        int $changedBy,
        ?string $notes = null,
    ): void {
        $this->interviews->createStatusHistory([
            'interview_id' => $interview->id,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'changed_by' => $changedBy,
            'notes' => $notes,
            'created_at' => now(),
        ]);
    }

    /**
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    private function logAudit(
        Interview $interview,
        AuditAction $action,
        User $actor,
        Request $request,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        AuditLog::query()->create([
            'user_id' => $actor->id,
            'action' => $action,
            'auditable_type' => Interview::class,
            'auditable_id' => $interview->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }

    /**
     * @param  array<string, mixed>|null  $properties
     */
    private function logActivity(
        User $actor,
        int $companyId,
        string $type,
        string $description,
        Interview $interview,
        ?array $properties = null,
    ): void {
        ActivityLog::query()->create([
            'user_id' => $actor->id,
            'company_id' => $companyId,
            'activity_type' => $type,
            'description' => $description,
            'subject_type' => Interview::class,
            'subject_id' => $interview->id,
            'properties' => $properties,
            'created_at' => now(),
        ]);
    }
}
