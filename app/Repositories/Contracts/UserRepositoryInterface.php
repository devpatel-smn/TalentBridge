<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function create(array $attributes): User;

    public function findByEmail(string $email): ?User;

    public function findById(int $id): ?User;

    public function update(User $user, array $attributes): User;

    public function updateLastLogin(User $user, string $ipAddress): User;
}
