<?php

namespace App\Modules\JobSeeker\Repositories\Contracts;

use App\Models\Experience;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ExperienceRepositoryInterface
{
    public function findForProfile(int $profileId, int $experienceId): ?Experience;

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(int $profileId, array $attributes): Experience;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Experience $experience, array $attributes): Experience;

    public function delete(Experience $experience): void;

    public function countForProfile(int $profileId): int;
}
