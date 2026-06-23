<?php

namespace App\Models;

use Database\Factories\RoleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

/**
 * @property int $id
 * @property string $name
 * @property string $guard_name
 */
class Role extends SpatieRole
{
    /** @use HasFactory<RoleFactory> */
    use HasFactory;

    public const ADMIN = 'admin';

    public const EMPLOYER = 'employer';

    public const JOB_SEEKER = 'job_seeker';

    /**
     * @return list<string>
     */
    public static function registrable(): array
    {
        return [self::EMPLOYER, self::JOB_SEEKER];
    }
}
