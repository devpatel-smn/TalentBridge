<?php

namespace App\Modules\JobSeeker\Repositories\Contracts;

use App\Models\Education;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EducationRepositoryInterface
{
    public function findForProfile(int $profileId, int $educationId): ?Education;

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(int $profileId, array $attributes): Education;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Education $education, array $attributes): Education;

    public function delete(Education $education): void;

    public function countForProfile(int $profileId): int;
}
