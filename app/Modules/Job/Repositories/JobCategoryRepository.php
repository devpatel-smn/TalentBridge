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
            ->roots()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'sort_order']);
    }
}
