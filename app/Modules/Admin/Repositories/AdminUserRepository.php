<?php

namespace App\Modules\Admin\Repositories;

use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminUserRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminUserRepository implements AdminUserRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = User::query()->with(['roles']);

        if (in_array('jobSeekerProfile', $params->includes, true)) {
            $query->with('jobSeekerProfile');
        }

        if (in_array('employerUsers', $params->includes, true)) {
            $query->with('employerUsers.company');
        }

        if (isset($params->filters['role'])) {
            $role = (string) $params->filters['role'];
            unset($params->filters['role']);
            $query->role($role);
        }

        $this->applyListQuery(
            $query,
            $params,
            ['first_name', 'last_name', 'email'],
            ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'last_login_at'],
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findById(int $id): ?User
    {
        return User::query()
            ->with(['roles', 'jobSeekerProfile', 'employerUsers.company'])
            ->find($id);
    }

    public function create(array $attributes): User
    {
        return User::query()->create($attributes);
    }

    public function update(User $user, array $attributes): User
    {
        $user->update($attributes);

        return $user->fresh(['roles', 'jobSeekerProfile', 'employerUsers.company']);
    }

    public function delete(User $user): bool
    {
        return (bool) $user->delete();
    }
}
