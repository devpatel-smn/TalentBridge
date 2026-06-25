<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function create(array $attributes): User
    {
        return User::query()->create($attributes);
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()
            ->whereRaw('LOWER(email) = ?', [strtolower($email)])
            ->first();
    }

    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function update(User $user, array $attributes): User
    {
        $user->update($attributes);

        return $user->fresh();
    }

    public function updateLastLogin(User $user, string $ipAddress): User
    {
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ipAddress,
        ]);

        return $user->fresh();
    }
}
