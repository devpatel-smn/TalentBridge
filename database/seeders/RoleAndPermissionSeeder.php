<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Support\Permissions;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = 'web';

        foreach (Permissions::all() as $permissionName) {
            Permission::query()->firstOrCreate([
                'name' => $permissionName,
                'guard_name' => $guard,
            ]);
        }

        $roles = [
            Role::ADMIN => Permissions::all(),
            Role::EMPLOYER => [
                Permissions::COMPANIES_VIEW,
                Permissions::COMPANIES_UPDATE,
                Permissions::JOBS_VIEW,
                Permissions::JOBS_CREATE,
                Permissions::JOBS_UPDATE,
                Permissions::JOBS_DELETE,
                Permissions::JOBS_PUBLISH,
                Permissions::APPLICATIONS_VIEW,
                Permissions::APPLICATIONS_MANAGE,
                Permissions::INTERVIEWS_VIEW,
                Permissions::INTERVIEWS_MANAGE,
                Permissions::PROFILES_VIEW,
                Permissions::ANALYTICS_VIEW,
            ],
            Role::JOB_SEEKER => [
                Permissions::COMPANIES_VIEW,
                Permissions::JOBS_VIEW,
                Permissions::APPLICATIONS_VIEW,
                Permissions::INTERVIEWS_VIEW,
                Permissions::PROFILES_VIEW,
                Permissions::PROFILES_MANAGE,
                Permissions::RESUMES_MANAGE,
            ],
        ];

        DB::transaction(function () use ($roles, $guard) {
            foreach ($roles as $roleName => $permissionNames) {
                $role = Role::query()->firstOrCreate([
                    'name' => $roleName,
                    'guard_name' => $guard,
                ]);

                $permissionIds = Permission::query()
                    ->whereIn('name', $permissionNames)
                    ->where('guard_name', $guard)
                    ->pluck('id');

                $role->permissions()->sync($permissionIds);
            }
        });
    }
}
