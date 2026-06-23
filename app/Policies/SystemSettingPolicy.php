<?php

namespace App\Policies;

use App\Models\SystemSetting;
use App\Models\User;
use App\Support\Permissions;

class SystemSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(Permissions::SETTINGS_MANAGE);
    }

    public function view(User $user, SystemSetting $setting): bool
    {
        return $user->can(Permissions::SETTINGS_MANAGE);
    }

    public function update(User $user): bool
    {
        return $user->can(Permissions::SETTINGS_MANAGE);
    }
}
