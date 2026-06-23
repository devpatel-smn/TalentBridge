<?php

namespace App\Modules\Application\Services;

use App\Enums\ApplicationStatus;
use App\Enums\AuditAction;
use App\Enums\JobStatus;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\JobSeekerProfile;
use App\Models\Resume;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Application\Repositories\Contracts\JobApplicationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApplicationService
{
    public function __construct(
        private readonly JobApplicationRepositoryInterface $applications,
        private readonly ApplicationStatusService $statusService,
    ) {}

    public function listForJobSeeker(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->applications->paginateForJobSeeker($profileId, $params);
    }

    public function listForCompany(int $companyId, ListQueryParams $params, ?string $jobUuid = null): LengthAwarePaginator
    {
        return $this->applications->paginateForCompany($companyId, $params, $jobUuid);
    }

    public function findForJobSeeker(string $uuid, int $profileId): JobApplication
    {
        return $this->applications->findForJobSeeker($uuid, $profileId)
            ?? throw ValidationException::withMessages(['application' => ['Application not found.']]);
    }

    public function findForCompany(string $uuid, int $companyId): JobApplication
    {
        return $this->applications->findForCompany($uuid, $companyId)
            ?? throw ValidationException::withMessages(['application' => ['Application not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function apply(JobSeekerProfile $profile, Job $job, array $data, User $actor, Request $request): JobApplication
    {
        if ($job->status !== JobStatus::Published) {
            throw ValidationException::withMessages([
                'job' => ['Only published jobs can receive applications.'],
            ]);
        }

        if ($job->application_deadline && $job->application_deadline->isPast()) {
            throw ValidationException::withMessages([
                'job' => ['The application deadline for this job has passed.'],
            ]);
        }

        if ($job->closed_at !== null) {
            throw ValidationException::withMessages([
                'job' => ['This job is no longer accepting applications.'],
            ]);
        }

        if ($job->company?->created_by === $actor->id || $actor->belongsToCompany($job->company_id)) {
            throw ValidationException::withMessages([
                'job' => ['You cannot apply to your own company job posting.'],
            ]);
        }

        $resume = $this->resolveResume($profile, $data['resume_uuid'] ?? null);

        return DB::transaction(function () use ($profile, $job, $data, $actor, $request, $resume) {
            $lockedJob = $this->applications->lockJobForUpdate($job->id);

            if ($this->applications->existsForJobAndProfile($lockedJob->id, $profile->id)) {
                throw ValidationException::withMessages([
                    'job' => ['You have already applied to this job.'],
                ]);
            }

            $application = $this->applications->create([
                'job_id' => $lockedJob->id,
                'job_seeker_profile_id' => $profile->id,
                'resume_id' => $resume?->id,
                'cover_letter' => $data['cover_letter'] ?? null,
                'status' => ApplicationStatus::Submitted,
                'applied_at' => now(),
                'status_changed_at' => now(),
            ]);

            $lockedJob->increment('applications_count');

            $this->recordStatusHistory($application, null, ApplicationStatus::Submitted, $actor->id, 'Application submitted.');
            $this->logAudit($application, AuditAction::Created, $actor, $request, null, [
                'job_id' => $application->job_id,
                'job_uuid' => $application->job?->uuid,
                'resume_id' => $application->resume_id,
                'status' => $application->status->value,
            ]);
            $this->logActivity(
                $actor,
                $lockedJob->company_id,
                'application.submitted',
                "Application submitted for \"{$lockedJob->title}\".",
                $application,
                ['job_uuid' => $lockedJob->uuid, 'application_uuid' => $application->uuid]
            );

            return $application->fresh([
                'job.company.logo',
                'job.category',
                'resume.file',
                'jobSeekerProfile.user',
                'statusHistories.changedByUser',
            ]);
        });
    }

    public function withdraw(JobApplication $application, User $actor, Request $request): JobApplication
    {
        $this->statusService->assertTransitionAllowed($application->status, ApplicationStatus::Withdrawn);

        return DB::transaction(function () use ($application, $actor, $request) {
            $oldValues = [
                'status' => $application->status->value,
                'status_changed_at' => $application->status_changed_at?->toIso8601String(),
            ];

            $updated = $this->applications->update($application, [
                'status' => ApplicationStatus::Withdrawn,
                'status_changed_at' => now(),
            ]);

            $this->recordStatusHistory($updated, $application->status, ApplicationStatus::Withdrawn, $actor->id, 'Application withdrawn by candidate.');
            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'status' => ApplicationStatus::Withdrawn->value,
            ]);
            $this->logActivity(
                $actor,
                $updated->job->company_id,
                'application.withdrawn',
                "Application for \"{$updated->job->title}\" withdrawn.",
                $updated,
                ['job_uuid' => $updated->job->uuid, 'application_uuid' => $updated->uuid]
            );

            return $updated;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateStatus(JobApplication $application, array $data, User $actor, Request $request): JobApplication
    {
        $toStatus = ApplicationStatus::from($data['status']);
        $this->statusService->assertTransitionAllowed($application->status, $toStatus);

        if ($toStatus === ApplicationStatus::Rejected && empty($data['rejection_reason'])) {
            throw ValidationException::withMessages([
                'rejection_reason' => ['A rejection reason is required when rejecting an application.'],
            ]);
        }

        if ($toStatus !== ApplicationStatus::Rejected && array_key_exists('rejection_reason', $data) && $data['rejection_reason'] !== null) {
            throw ValidationException::withMessages([
                'rejection_reason' => ['Rejection reason can only be set when status is rejected.'],
            ]);
        }

        return DB::transaction(function () use ($application, $data, $actor, $request, $toStatus) {
            $fromStatus = $application->status;
            $oldValues = [
                'status' => $application->status->value,
                'rejection_reason' => $application->rejection_reason,
                'employer_notes' => $application->employer_notes,
            ];

            $attributes = [
                'status' => $toStatus,
                'status_changed_at' => now(),
                'updated_at' => now(),
            ];

            if (array_key_exists('employer_notes', $data)) {
                $attributes['employer_notes'] = $data['employer_notes'];
            }

            $attributes['rejection_reason'] = $toStatus === ApplicationStatus::Rejected
                ? ($data['rejection_reason'] ?? $application->rejection_reason)
                : null;

            $updated = $this->applications->update($application, $attributes);

            $this->recordStatusHistory(
                $updated,
                $fromStatus,
                $toStatus,
                $actor->id,
                $data['notes'] ?? $this->defaultStatusHistoryNote($toStatus)
            );

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'status' => $toStatus->value,
                'rejection_reason' => $updated->rejection_reason,
                'employer_notes' => $updated->employer_notes,
            ]);
            $this->logActivity(
                $actor,
                $updated->job->company_id,
                'application.status_updated',
                "Application status for \"{$updated->job->title}\" changed to {$toStatus->value}.",
                $updated,
                [
                    'job_uuid' => $updated->job->uuid,
                    'application_uuid' => $updated->uuid,
                    'from_status' => $fromStatus->value,
                    'to_status' => $toStatus->value,
                ]
            );

            return $updated;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateEmployerNotes(JobApplication $application, array $data, User $actor, Request $request): JobApplication
    {
        return DB::transaction(function () use ($application, $data, $actor, $request) {
            $oldValues = ['employer_notes' => $application->employer_notes];

            $updated = $this->applications->update($application, [
                'employer_notes' => $data['employer_notes'] ?? null,
            ]);

            $this->logAudit($updated, AuditAction::Updated, $actor, $request, $oldValues, [
                'employer_notes' => $updated->employer_notes,
            ]);
            $this->logActivity(
                $actor,
                $updated->job->company_id,
                'application.notes_updated',
                "Candidate notes updated for \"{$updated->job->title}\".",
                $updated,
                ['job_uuid' => $updated->job->uuid, 'application_uuid' => $updated->uuid]
            );

            return $updated;
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function analyticsForJob(int $companyId, string $jobUuid): array
    {
        $analytics = $this->applications->analyticsForJob($companyId, $jobUuid);

        if ($analytics === []) {
            throw ValidationException::withMessages(['job' => ['Job not found.']]);
        }

        return $analytics;
    }

    private function resolveResume(JobSeekerProfile $profile, ?string $resumeUuid): ?Resume
    {
        if ($resumeUuid === null) {
            return Resume::query()
                ->where('job_seeker_profile_id', $profile->id)
                ->where('is_primary', true)
                ->first();
        }

        $resume = Resume::query()
            ->where('job_seeker_profile_id', $profile->id)
            ->where('uuid', $resumeUuid)
            ->first();

        if (! $resume) {
            throw ValidationException::withMessages([
                'resume_uuid' => ['Selected resume not found.'],
            ]);
        }

        return $resume;
    }

    private function recordStatusHistory(
        JobApplication $application,
        ?ApplicationStatus $fromStatus,
        ApplicationStatus $toStatus,
        int $changedBy,
        ?string $notes = null,
    ): void {
        $this->applications->createStatusHistory([
            'job_application_id' => $application->id,
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
        JobApplication $application,
        AuditAction $action,
        User $actor,
        Request $request,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        AuditLog::query()->create([
            'user_id' => $actor->id,
            'action' => $action,
            'auditable_type' => JobApplication::class,
            'auditable_id' => $application->id,
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
        JobApplication $application,
        ?array $properties = null,
    ): void {
        ActivityLog::query()->create([
            'user_id' => $actor->id,
            'company_id' => $companyId,
            'activity_type' => $type,
            'description' => $description,
            'subject_type' => JobApplication::class,
            'subject_id' => $application->id,
            'properties' => $properties,
            'created_at' => now(),
        ]);
    }

    private function defaultStatusHistoryNote(ApplicationStatus $status): string
    {
        return match ($status) {
            ApplicationStatus::UnderReview => 'Application moved to review.',
            ApplicationStatus::Shortlisted => 'Candidate shortlisted.',
            ApplicationStatus::Offered => 'Candidate selected and offer recorded.',
            ApplicationStatus::Hired => 'Candidate marked as hired.',
            ApplicationStatus::Rejected => 'Application rejected.',
            ApplicationStatus::Withdrawn => 'Application withdrawn.',
            default => 'Application status updated.',
        };
    }
}
