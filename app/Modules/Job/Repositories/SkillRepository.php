<?php

namespace App\Modules\Job\Repositories;

use App\Models\Skill;
use App\Modules\Job\Repositories\Contracts\SkillRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SkillRepository implements SkillRepositoryInterface
{
    public function search(?string $term, int $perPage = 20): LengthAwarePaginator
    {
        $query = Skill::query()->orderBy('name');

        if ($term !== null && $term !== '') {
            $search = '%'.$term.'%';
            $query->where('name', 'ilike', $search);
        }

        return $query->paginate(perPage: min(50, max(1, $perPage)));
    }
}
