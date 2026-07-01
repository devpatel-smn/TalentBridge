<?php

namespace App\Modules\Job\Services;

use App\Models\Company;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Job\Repositories\Contracts\PublicCompanyRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;

class PublicCompanyService
{
    public function __construct(
        private readonly PublicCompanyRepositoryInterface $companies,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->companies->paginatePublic($params);
    }

    public function findBySlug(string $slug): Company
    {
        $company = $this->companies->findBySlug($slug);

        if ($company === null) {
            throw new ModelNotFoundException('Company not found.');
        }

        return $company;
    }

    /**
     * @return Collection<int, string>
     */
    public function industries(): Collection
    {
        return $this->companies->distinctIndustries();
    }
}
