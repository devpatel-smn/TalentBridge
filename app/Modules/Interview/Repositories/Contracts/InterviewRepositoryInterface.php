<?php

namespace App\Modules\Interview\Repositories\Contracts;

use App\Models\Interview;
use App\Models\InterviewParticipant;
use App\Models\InterviewStatusHistory;
use App\Models\JobApplication;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface InterviewRepositoryInterface
{
    public function findByUuid(
        string $uuid,
        ?int $companyId = null,
        ?int $profileId = null,
    ): ?Interview;

    public function paginateForCompany(int $companyId, ListQueryParams $params, bool $upcomingOnly = false): LengthAwarePaginator;

    public function paginateForProfile(int $profileId, ListQueryParams $params, bool $upcomingOnly = false): LengthAwarePaginator;

    public function findApplicationForCompany(string $applicationUuid, int $companyId): ?JobApplication;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Interview;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Interview $interview, array $attributes): Interview;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function createParticipant(array $attributes): InterviewParticipant;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function createStatusHistory(array $attributes): InterviewStatusHistory;

    /**
     * @return Collection<int, InterviewStatusHistory>
     */
    public function getStatusHistories(int $interviewId): Collection;

    /**
     * @param  list<int>  $userIds
     * @return list<int>
     */
    public function filterCompanyMemberUserIds(int $companyId, array $userIds): array;

    public function hasActiveSchedulingConflict(
        int $jobApplicationId,
        string $scheduledAt,
        int $durationMinutes,
        ?int $excludeInterviewId = null,
    ): bool;
}
