<?php

namespace App\Policies;

use App\Models\User;
use App\Support\Permissions;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::USERS_VIEW);
    }

    public function view(User $user, User $model): bool
    {
        return $user->can(Permissions::USERS_VIEW) || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->can(Permissions::USERS_CREATE);
    }

    public function update(User $user, User $model): bool
    {
        return $user->can(Permissions::USERS_UPDATE) || $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        return $user->can(Permissions::USERS_DELETE) && $user->id !== $model->id;
    }

    public function suspend(User $user, User $model): bool
    {
        return $user->can(Permissions::USERS_SUSPEND) && $user->id !== $model->id;
    }
}
