<?php

namespace App\Modules\Interview\Repositories;

use App\Enums\InterviewStatus;
use App\Models\EmployerUser;
use App\Models\Interview;
use App\Models\InterviewParticipant;
use App\Models\InterviewStatusHistory;
use App\Models\JobApplication;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Interview\Repositories\Contracts\InterviewRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class InterviewRepository implements InterviewRepositoryInterface
{
    private const SORTABLE_FIELDS = [
        'scheduled_at',
        'created_at',
        'updated_at',
        'status',
    ];

    /**
     * @var list<string>
     */
    private const DEFAULT_RELATIONS = [
        'company',
        'jobApplication.job',
        'jobApplication.jobSeekerProfile.user',
        'participants.user',
        'scheduler',
    ];

    public function findByUuid(
        string $uuid,
        ?int $companyId = null,
        ?int $profileId = null,
    ): ?Interview {
        $query = Interview::query()
            ->with(self::DEFAULT_RELATIONS)
            ->where('uuid', $uuid)
            ->whereNull('deleted_at');

        if ($companyId !== null) {
            $query->where('company_id', $companyId);
        }

        if ($profileId !== null) {
            $query->whereHas('jobApplication', fn ($builder) => $builder
                ->where('job_seeker_profile_id', $profileId)
                ->whereNull('deleted_at'));
        }

        return $query->first();
    }

    public function paginateForCompany(int $companyId, ListQueryParams $params, bool $upcomingOnly = false): LengthAwarePaginator
    {
        $query = Interview::query()
            ->with(self::DEFAULT_RELATIONS)
            ->where('company_id', $companyId)
            ->whereNull('deleted_at');

        $this->applyListFilters($query, $params, $upcomingOnly);

        return $this->paginate($query, $params);
    }

    public function paginateForProfile(int $profileId, ListQueryParams $params, bool $upcomingOnly = false): LengthAwarePaginator
    {
        $query = Interview::query()
            ->with(self::DEFAULT_RELATIONS)
            ->whereNull('deleted_at')
            ->whereHas('jobApplication', fn ($builder) => $builder
                ->where('job_seeker_profile_id', $profileId)
                ->whereNull('deleted_at'));

        $this->applyListFilters($query, $params, $upcomingOnly);

        return $this->paginate($query, $params);
    }

    public function findApplicationForCompany(string $applicationUuid, int $companyId): ?JobApplication
    {
        return JobApplication::query()
            ->with(['job', 'jobSeekerProfile.user'])
            ->where('uuid', $applicationUuid)
            ->whereNull('deleted_at')
            ->whereHas('job', fn ($query) => $query->where('company_id', $companyId))
            ->first();
    }

    public function create(array $attributes): Interview
    {
        return Interview::query()->create($attributes);
    }

    public function update(Interview $interview, array $attributes): Interview
    {
        $interview->update($attributes);

        return $interview->fresh(self::DEFAULT_RELATIONS);
    }

    public function createParticipant(array $attributes): InterviewParticipant
    {
        return InterviewParticipant::query()->create($attributes);
    }

    public function createStatusHistory(array $attributes): InterviewStatusHistory
    {
        return InterviewStatusHistory::query()->create($attributes);
    }

    public function getStatusHistories(int $interviewId): Collection
    {
        return InterviewStatusHistory::query()
            ->with('changedByUser')
            ->where('interview_id', $interviewId)
            ->orderBy('created_at')
            ->get();
    }

    public function filterCompanyMemberUserIds(int $companyId, array $userIds): array
    {
        if ($userIds === []) {
            return [];
        }

        return EmployerUser::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->whereIn('user_id', $userIds)
            ->pluck('user_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    public function hasActiveSchedulingConflict(
        int $jobApplicationId,
        string $scheduledAt,
        int $durationMinutes,
        ?int $excludeInterviewId = null,
    ): bool {
        $start = Carbon::parse($scheduledAt);
        $end = $start->copy()->addMinutes($durationMinutes);

        $query = Interview::query()
            ->where('job_application_id', $jobApplicationId)
            ->whereIn('status', [
                InterviewStatus::Scheduled,
                InterviewStatus::Confirmed,
                InterviewStatus::Rescheduled,
            ])
            ->whereNull('deleted_at');

        if ($excludeInterviewId !== null) {
            $query->where('id', '!=', $excludeInterviewId);
        }

        return $query
            ->get(['id', 'scheduled_at', 'duration_minutes'])
            ->contains(function (Interview $interview) use ($start, $end): bool {
                $interviewStart = $interview->scheduled_at;
                $interviewEnd = $interviewStart->copy()->addMinutes($interview->duration_minutes);

                return $start->equalTo($interviewStart)
                    || ($start->lt($interviewEnd) && $end->gt($interviewStart));
            });
    }

    /**
     * @param  Builder<Interview>  $query
     */
    private function applyListFilters($query, ListQueryParams $params, bool $upcomingOnly): void
    {
        if ($upcomingOnly) {
            $query->upcoming();
        }

        if (! empty($params->filters['status'])) {
            $query->where('status', $params->filters['status']);
        }

        if (! empty($params->filters['application_uuid'])) {
            $applicationUuid = (string) $params->filters['application_uuid'];
            $query->whereHas('jobApplication', fn ($builder) => $builder->where('uuid', $applicationUuid));
        }

        if (! empty($params->filters['job_uuid'])) {
            $jobUuid = (string) $params->filters['job_uuid'];
            $query->whereHas('jobApplication.job', fn ($builder) => $builder->where('uuid', $jobUuid));
        }

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('title', 'ilike', $search)
                    ->orWhereHas('jobApplication.jobSeekerProfile.user', fn ($userQuery) => $userQuery
                        ->where('first_name', 'ilike', $search)
                        ->orWhere('last_name', 'ilike', $search)
                        ->orWhere('email', 'ilike', $search));
            });
        }

        if (in_array('status_history', $params->includes, true)) {
            $query->with(['statusHistories.changedByUser']);
        }
    }

    /**
     * @param  Builder<Interview>  $query
     */
    private function paginate($query, ListQueryParams $params): LengthAwarePaginator
    {
        $sort = in_array($params->sort, self::SORTABLE_FIELDS, true) ? $params->sort : 'scheduled_at';

        return $query
            ->orderBy($sort, $params->order)
            ->paginate($params->perPage, ['*'], 'page', $params->page);
    }
}
