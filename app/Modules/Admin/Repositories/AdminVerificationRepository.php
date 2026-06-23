<?php

namespace App\Modules\Admin\Repositories;

use App\Models\CompanyVerification;
use App\Modules\Admin\Repositories\Contracts\AdminVerificationRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminVerificationRepository implements AdminVerificationRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = CompanyVerification::query()
            ->with(['company', 'submitter', 'reviewer']);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->whereHas('company', fn ($q) => $q->where('name', 'ilike', $search));
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'status', 'created_at', 'reviewed_at'],
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findById(int $id): ?CompanyVerification
    {
        return CompanyVerification::query()
            ->with(['company.logo', 'submitter', 'reviewer'])
            ->find($id);
    }

    public function update(CompanyVerification $verification, array $attributes): CompanyVerification
    {
        $verification->update($attributes);

        return $verification->fresh(['company', 'submitter', 'reviewer']);
    }
}
