<?php

namespace App\Modules\Job\Repositories\Contracts;

use App\Models\Company;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PublicCompanyRepositoryInterface
{
    public function paginatePublic(ListQueryParams $params): LengthAwarePaginator;

    public function findBySlug(string $slug): ?Company;

    /**
     * @return Collection<int, string>
     */
    public function distinctIndustries(): Collection;
}
