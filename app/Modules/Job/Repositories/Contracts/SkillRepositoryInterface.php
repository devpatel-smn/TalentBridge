<?php

namespace App\Modules\Job\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SkillRepositoryInterface
{
    public function search(?string $term, int $perPage = 20): LengthAwarePaginator;
}
