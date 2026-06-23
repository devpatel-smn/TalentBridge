<?php

namespace App\Modules\Application\Repositories;

use App\Enums\ApplicationStatus;
use App\Models\ApplicationStatusHistory;
use App\Models\Job;
use App\Models\JobApplication;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Application\Repositories\Contracts\JobApplicationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class JobApplicationRepository implements JobApplicationRepositoryInterface
{
    private const SORTABLE_FIELDS = [
        'applied_at',
        'created_at',
        'updated_at',
        'status',
        'status_changed_at',
    ];

    public function paginateForJobSeeker(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        $query = JobApplication::query()
            ->with([
                'job.company.logo',
                'job.category',
                'resume',
            ])
            ->where('job_seeker_profile_id', $profileId);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->whereHas('job', fn ($jobQuery) => $jobQuery
                    ->where('title', 'ilike', $search)
                    ->orWhereHas('company', fn ($companyQuery) => $companyQuery->where('name', 'ilike', $search)));
            });
        }

        if (! empty($params->filters['status'])) {
            $query->where('status', $params->filters['status']);
        }

        if (! empty($params->filters['job_uuid'])) {
            $jobUuid = (string) $params->filters['job_uuid'];
            $query->whereHas('job', fn ($builder) => $builder->where('uuid', $jobUuid));
        }

        if (! empty($params->includes) && in_array('status_history', $params->includes, true)) {
            $query->with(['statusHistories.changedByUser']);
        }

        $sort = in_array($params->sort, self::SORTABLE_FIELDS, true) ? $params->sort : 'applied_at';

        return $query
            ->orderBy($sort, $params->order)
            ->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function paginateForCompany(int $companyId, ListQueryParams $params, ?string $jobUuid = null): LengthAwarePaginator
    {
        $query = JobApplication::query()
            ->with([
                'job.company',
                'resume',
                'jobSeekerProfile.user',
            ])
            ->whereHas('job', function ($builder) use ($companyId, $jobUuid): void {
                $builder->where('company_id', $companyId);

                if ($jobUuid !== null) {
                    $builder->where('uuid', $jobUuid);
                }
            });

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->whereHas('job', fn ($jobQuery) => $jobQuery->where('title', 'ilike', $search))
                    ->orWhereHas('jobSeekerProfile.user', fn ($userQuery) => $userQuery
                        ->where('first_name', 'ilike', $search)
                        ->orWhere('last_name', 'ilike', $search)
                        ->orWhere('email', 'ilike', $search));
            });
        }

        if (! empty($params->filters['status'])) {
            $query->where('status', $params->filters['status']);
        }

        if (! empty($params->filters['job_uuid'])) {
            $query->whereHas('job', fn ($builder) => $builder->where('uuid', (string) $params->filters['job_uuid']));
        }

        $sort = in_array($params->sort, self::SORTABLE_FIELDS, true) ? $params->sort : 'applied_at';

        return $query
            ->orderBy($sort, $params->order)
            ->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function findForJobSeeker(string $uuid, int $profileId): ?JobApplication
    {
        return JobApplication::query()
            ->with([
                'job.company.logo',
                'job.category',
                'resume',
                'statusHistories.changedByUser',
            ])
            ->where('uuid', $uuid)
            ->where('job_seeker_profile_id', $profileId)
            ->first();
    }

    public function findForCompany(string $uuid, int $companyId): ?JobApplication
    {
        return JobApplication::query()
            ->with([
                'job.company',
                'resume.file',
                'jobSeekerProfile.user',
                'statusHistories.changedByUser',
            ])
            ->where('uuid', $uuid)
            ->whereHas('job', fn ($builder) => $builder->where('company_id', $companyId))
            ->first();
    }

    public function existsForJobAndProfile(int $jobId, int $profileId): bool
    {
        return JobApplication::query()
            ->where('job_id', $jobId)
            ->where('job_seeker_profile_id', $profileId)
            ->exists();
    }

    public function create(array $attributes): JobApplication
    {
        $application = JobApplication::query()->create($attributes);

        return $application->fresh([
            'job.company',
            'resume',
            'jobSeekerProfile.user',
        ]);
    }

    public function update(JobApplication $application, array $attributes): JobApplication
    {
        $application->update($attributes);

        return $application->fresh([
            'job.company',
            'resume.file',
            'jobSeekerProfile.user',
            'statusHistories.changedByUser',
        ]);
    }

    public function createStatusHistory(array $attributes): ApplicationStatusHistory
    {
        return ApplicationStatusHistory::query()->create($attributes);
    }

    public function lockJobForUpdate(int $jobId): Job
    {
        return Job::query()->whereKey($jobId)->lockForUpdate()->firstOrFail();
    }

    public function analyticsForJob(int $companyId, string $jobUuid): array
    {
        $job = Job::query()
            ->where('company_id', $companyId)
            ->where('uuid', $jobUuid)
            ->first();

        if (! $job) {
            return [];
        }

        $baseQuery = JobApplication::query()
            ->where('job_id', $job->id)
            ->whereNull('deleted_at');

        $statusCounts = (clone $baseQuery)
            ->select('status', DB::raw('COUNT(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $timeline = (clone $baseQuery)
            ->selectRaw('DATE(applied_at) as date, COUNT(*) as total')
            ->where('applied_at', '>=', now()->subDays(29)->startOfDay())
            ->groupByRaw('DATE(applied_at)')
            ->orderByRaw('DATE(applied_at)')
            ->get()
            ->map(fn ($row) => [
                'date' => (string) $row->date,
                'total' => (int) $row->total,
            ])
            ->values()
            ->all();

        $averageHoursToReview = ApplicationStatusHistory::query()
            ->join('job_applications', 'job_applications.id', '=', 'application_status_histories.job_application_id')
            ->where('job_applications.job_id', $job->id)
            ->where('application_status_histories.to_status', ApplicationStatus::UnderReview->value)
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (application_status_histories.created_at - job_applications.applied_at)) / 3600) as average_hours')
            ->value('average_hours');

        $byStatus = [];
        foreach (ApplicationStatus::cases() as $status) {
            $byStatus[$status->value] = (int) ($statusCounts[$status->value] ?? 0);
        }

        $total = (int) array_sum($byStatus);

        return [
            'job' => [
                'uuid' => $job->uuid,
                'title' => $job->title,
                'applications_count' => (int) $job->applications_count,
            ],
            'totals' => [
                'applications' => $total,
                'submitted' => $byStatus[ApplicationStatus::Submitted->value],
                'under_review' => $byStatus[ApplicationStatus::UnderReview->value],
                'shortlisted' => $byStatus[ApplicationStatus::Shortlisted->value],
                'offered' => $byStatus[ApplicationStatus::Offered->value],
                'hired' => $byStatus[ApplicationStatus::Hired->value],
                'rejected' => $byStatus[ApplicationStatus::Rejected->value],
                'withdrawn' => $byStatus[ApplicationStatus::Withdrawn->value],
            ],
            'rates' => [
                'shortlist_rate' => $total > 0 ? round(($byStatus[ApplicationStatus::Shortlisted->value] / $total) * 100, 2) : 0.0,
                'offer_rate' => $total > 0 ? round(($byStatus[ApplicationStatus::Offered->value] / $total) * 100, 2) : 0.0,
                'hire_rate' => $total > 0 ? round(($byStatus[ApplicationStatus::Hired->value] / $total) * 100, 2) : 0.0,
                'rejection_rate' => $total > 0 ? round(($byStatus[ApplicationStatus::Rejected->value] / $total) * 100, 2) : 0.0,
            ],
            'average_hours_to_review' => $averageHoursToReview !== null ? round((float) $averageHoursToReview, 2) : null,
            'timeline' => $timeline,
            'by_status' => $byStatus,
        ];
    }
}
