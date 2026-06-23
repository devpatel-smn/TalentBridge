<?php

namespace App\Modules\JobSeeker\Repositories\Contracts;

use App\Models\Resume;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ResumeRepositoryInterface
{
    public function findForProfile(int $profileId, string $uuid): ?Resume;

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(int $profileId, array $attributes): Resume;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Resume $resume, array $attributes): Resume;

    public function delete(Resume $resume): void;

    public function clearPrimaryForProfile(int $profileId, ?int $exceptResumeId = null): void;

    public function countForProfile(int $profileId): int;

    public function hasResumeForProfile(int $profileId): bool;

    /**
     * @param  list<array<string, mixed>>  $sections
     */
    public function syncSections(Resume $resume, array $sections): Collection;
}
