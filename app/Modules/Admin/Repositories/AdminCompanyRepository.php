<?php

namespace App\Modules\Admin\Repositories;

use App\Models\Company;
use App\Modules\Admin\Repositories\Contracts\AdminCompanyRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminCompanyRepository implements AdminCompanyRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = Company::query()->with(['creator', 'logo']);

        if (in_array('employerUsers', $params->includes, true)) {
            $query->with('employerUsers.user');
        }

        if (in_array('jobs', $params->includes, true)) {
            $query->withCount('jobs');
        }

        $this->applyListQuery(
            $query,
            $params,
            ['name', 'slug', 'industry', 'headquarters'],
            ['id', 'name', 'verification_status', 'created_at', 'industry'],
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findByUuid(string $uuid): ?Company
    {
        return Company::query()
            ->with(['creator', 'updater', 'verifier', 'logo', 'employerUsers.user', 'verifications'])
            ->withCount('jobs')
            ->where('uuid', $uuid)
            ->first();
    }

    public function update(Company $company, array $attributes): Company
    {
        $company->update($attributes);

        return $company->fresh(['creator', 'updater', 'verifier', 'logo']);
    }

    public function delete(Company $company): bool
    {
        return (bool) $company->delete();
    }
}
