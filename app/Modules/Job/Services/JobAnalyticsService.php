<?php

namespace App\Modules\Job\Services;

use App\Enums\JobStatus;
use App\Models\Job;
use Illuminate\Validation\ValidationException;

class JobAnalyticsService
{
    /**
     * @return array<string, mixed>
     */
    public function forJob(Job $job): array
    {
        $viewsCount = $job->views_count;
        $applicationsCount = $job->applications_count;

        $applicationRate = $viewsCount > 0
            ? round(($applicationsCount / $viewsCount) * 100, 2)
            : 0.0;

        $daysPublished = $job->published_at
            ? (int) $job->published_at->diffInDays(now())
            : null;

        return [
            'job_uuid' => $job->uuid,
            'title' => $job->title,
            'status' => $job->status->value,
            'views_count' => $viewsCount,
            'applications_count' => $applicationsCount,
            'application_rate' => $applicationRate,
            'published_at' => $job->published_at?->toIso8601String(),
            'closed_at' => $job->closed_at?->toIso8601String(),
            'days_published' => $daysPublished,
            'is_featured' => $job->is_featured,
            'vacancies' => $job->vacancies,
            'status_breakdown' => $this->statusBreakdown($job),
        ];
    }

    /**
     * @return array<string, int>
     */
    private function statusBreakdown(Job $job): array
    {
        if ($job->status !== JobStatus::Published && $job->applications_count === 0) {
            return [];
        }

        return $job->applications()
            ->whereNull('deleted_at')
            ->get()
            ->groupBy(fn ($application) => $application->status->value)
            ->map(fn ($group) => $group->count())
            ->all();
    }

    public function assertCompanyOwnership(Job $job, int $companyId): void
    {
        if ($job->company_id !== $companyId) {
            throw ValidationException::withMessages(['job' => ['Job not found.']]);
        }
    }
}
