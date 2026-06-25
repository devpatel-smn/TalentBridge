<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@talentbridge.test');
        $password = env('ADMIN_PASSWORD', 'Password123!');

        $admin = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'first_name' => env('ADMIN_FIRST_NAME', 'System'),
                'last_name' => env('ADMIN_LAST_NAME', 'Administrator'),
                'password' => $password,
                'status' => UserStatus::Active,
                'email_verified_at' => now(),
                'timezone' => 'UTC',
                'locale' => 'en',
            ]
        );

        if (! $admin->hasRole(Role::ADMIN)) {
            $admin->assignRole(Role::ADMIN);
        }

        if ($admin->status !== UserStatus::Active) {
            $admin->update(['status' => UserStatus::Active]);
        }

        if (! $admin->hasVerifiedEmail()) {
            $admin->forceFill(['email_verified_at' => now()])->save();
        }
    }
}
