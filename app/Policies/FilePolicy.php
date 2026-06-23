<?php

namespace App\Policies;

use App\Models\File;
use App\Models\User;

class FilePolicy
{
    public function view(User $user, File $file): bool
    {
        return $file->uploaded_by === $user->id || $user->isAdmin();
    }

    public function delete(User $user, File $file): bool
    {
        return $file->uploaded_by === $user->id || $user->isAdmin();
    }
}
