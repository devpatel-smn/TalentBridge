<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminUserRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findById(int $id): ?User;

    public function create(array $attributes): User;

    public function update(User $user, array $attributes): User;

    public function delete(User $user): bool;
}
