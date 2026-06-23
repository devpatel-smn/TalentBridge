<?php

namespace App\Modules\Job\Repositories\Contracts;

use App\Models\JobCategory;
use Illuminate\Support\Collection;

interface JobCategoryRepositoryInterface
{
    /**
     * @return Collection<int, JobCategory>
     */
    public function listActive(): Collection;
}
