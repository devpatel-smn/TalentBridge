<?php

namespace App\Modules\Job\Repositories;

use App\Models\JobCategory;
use App\Modules\Job\Repositories\Contracts\JobCategoryRepositoryInterface;
use Illuminate\Support\Collection;

class JobCategoryRepository implements JobCategoryRepositoryInterface
{
    public function listActive(): Collection
    {
        return JobCategory::query()
            ->active()
            ->with(['children' => fn ($query) => $query->active()->orderBy('sort_order')])
            ->roots()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }
}
