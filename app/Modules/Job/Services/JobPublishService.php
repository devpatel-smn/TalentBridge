<?php

namespace App\Modules\Job\Services;

use App\Enums\AuditAction;
use App\Enums\JobStatus;
use App\Enums\VerificationStatus;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\Job;
use App\Models\User;
use App\Modules\Job\Repositories\Contracts\JobRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JobPublishService
{
    public function __construct(
        private readonly JobRepositoryInterface $jobs,
    ) {}

    public function publish(Job $job, User $actor, Request $request): Job
    {
        if (! in_array($job->status, [JobStatus::Draft, JobStatus::Closed], true)) {
            throw ValidationException::withMessages([
                'status' => ['Only draft or closed jobs can be published.'],
            ]);
        }

        $company = Company::query()->find($job->company_id);

        if (! $company || $company->verification_status !== VerificationStatus::Approved) {
            throw ValidationException::withMessages([
                'company' => ['Company must be verified before publishing jobs.'],
            ]);
        }

        if (empty(trim($job->description))) {
            throw ValidationException::withMessages([
                'description' => ['Job description is required before publishing.'],
            ]);
        }

        return $this->transition($job, JobStatus::Published, $actor, $request, [
            'published_at' => $job->published_at ?? now(),
            'closed_at' => null,
        ], 'job.published', 'published');
    }

    public function close(Job $job, User $actor, Request $request): Job
    {
        if ($job->status !== JobStatus::Published) {
            throw ValidationException::withMessages([
                'status' => ['Only published jobs can be closed.'],
            ]);
        }

        return $this->transition($job, JobStatus::Closed, $actor, $request, [
            'closed_at' => now(),
        ], 'job.closed', 'closed');
    }

    public function archive(Job $job, User $actor, Request $request): Job
    {
        if ($job->status === JobStatus::Archived) {
            throw ValidationException::withMessages([
                'status' => ['Job is already archived.'],
            ]);
        }

        $attributes = ['status' => JobStatus::Archived];

        if ($job->status === JobStatus::Published) {
            $attributes['closed_at'] = now();
        }

        return $this->transition($job, JobStatus::Archived, $actor, $request, $attributes, 'job.archived', 'archived');
    }

    /**
     * @param  array<string, mixed>  $extraAttributes
     */
    private function transition(
        Job $job,
        JobStatus $newStatus,
        User $actor,
        Request $request,
        array $extraAttributes,
        string $activityType,
        string $actionLabel,
    ): Job {
        return DB::transaction(function () use ($job, $newStatus, $actor, $request, $extraAttributes, $activityType, $actionLabel) {
            $oldStatus = $job->status;

            $attributes = array_merge($extraAttributes, [
                'status' => $newStatus,
                'updated_by' => $actor->id,
            ]);

            $job = $this->jobs->update($job, $attributes);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Job::class,
                'auditable_id' => $job->id,
                'old_values' => ['status' => $oldStatus->value],
                'new_values' => ['status' => $newStatus->value],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            ActivityLog::query()->create([
                'user_id' => $actor->id,
                'company_id' => $job->company_id,
                'activity_type' => $activityType,
                'description' => "Job \"{$job->title}\" {$actionLabel}.",
                'subject_type' => Job::class,
                'subject_id' => $job->id,
                'properties' => [
                    'job_uuid' => $job->uuid,
                    'from_status' => $oldStatus->value,
                    'to_status' => $newStatus->value,
                ],
                'created_at' => now(),
            ]);

            return $job;
        });
    }
}
