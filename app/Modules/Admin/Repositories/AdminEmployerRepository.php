<?php

namespace App\Modules\Admin\Repositories;

use App\Models\EmployerUser;
use App\Modules\Admin\Repositories\Contracts\AdminEmployerRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminEmployerRepository implements AdminEmployerRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = EmployerUser::query()
            ->with(['user.roles', 'company']);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->whereHas('user', function ($userQuery) use ($search): void {
                $userQuery->where('first_name', 'ilike', $search)
                    ->orWhere('last_name', 'ilike', $search)
                    ->orWhere('email', 'ilike', $search);
            })->orWhereHas('company', function ($companyQuery) use ($search): void {
                $companyQuery->where('name', 'ilike', $search);
            });
        }

        if (isset($params->filters['is_active'])) {
            $query->where('is_active', filter_var($params->filters['is_active'], FILTER_VALIDATE_BOOLEAN));
            unset($params->filters['is_active']);
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'created_at', 'joined_at'],
            'created_at',
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findById(int $id): ?EmployerUser
    {
        return EmployerUser::query()
            ->with(['user.roles', 'company', 'inviter'])
            ->find($id);
    }
}
