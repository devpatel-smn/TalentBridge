<?php

namespace App\Models;

use Database\Factories\PermissionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * @property int $id
 * @property string $name
 * @property string $guard_name
 */
class Permission extends SpatiePermission
{
    /** @use HasFactory<PermissionFactory> */
    use HasFactory;
}
