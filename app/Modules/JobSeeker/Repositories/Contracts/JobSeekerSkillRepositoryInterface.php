<?php

namespace App\Modules\JobSeeker\Repositories\Contracts;

use App\Models\JobSeekerSkill;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface JobSeekerSkillRepositoryInterface
{
    public function findForProfile(int $profileId, int $jobSeekerSkillId): ?JobSeekerSkill;

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator;

    public function allForProfile(int $profileId): Collection;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(int $profileId, array $attributes): JobSeekerSkill;

    public function delete(JobSeekerSkill $jobSeekerSkill): void;

    public function countForProfile(int $profileId): int;

    public function existsForProfile(int $profileId, int $skillId): bool;
}
