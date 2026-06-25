<?php

namespace App\Modules\Auth\Services;

use App\Enums\AuditAction;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\EmployerUser;
use App\Models\JobSeekerProfile;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const LOCKOUT_CACHE_PREFIX = 'login_attempts:';

    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly EmailVerificationService $emailVerification,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function register(array $data, string $role): User
    {
        if (! in_array($role, Role::registrable(), true)) {
            throw ValidationException::withMessages([
                'role' => ['Registration is not allowed for this role.'],
            ]);
        }

        return DB::transaction(function () use ($data, $role) {
            $user = $this->users->create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => strtolower($data['email']),
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
                'status' => UserStatus::PendingVerification,
                'timezone' => $data['timezone'] ?? 'UTC',
                'locale' => $data['locale'] ?? 'en',
            ]);

            $user->assignRole($role);

            if ($role === Role::EMPLOYER) {
                $this->createEmployerRecords($user, $data['company_name']);
            }

            if ($role === Role::JOB_SEEKER) {
                JobSeekerProfile::query()->create([
                    'user_id' => $user->id,
                ]);
            }

            event(new Registered($user));
            $this->emailVerification->sendVerificationNotification($user);

            return $user->load(['roles', 'jobSeekerProfile', 'employerUsers.company']);
        });
    }

    /**
     * @return array{user: User}
     */
    public function login(string $email, string $password, Request $request): array
    {
        $email = strtolower($email);
        $user = $this->users->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->password)) {
            $this->handleFailedLogin($email);
        }

        if ($user->status === UserStatus::Suspended) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been suspended. Please contact support.'],
            ]);
        }

        if ($user->status === UserStatus::Inactive) {
            throw ValidationException::withMessages([
                'email' => ['Your account is inactive. Please contact support.'],
            ]);
        }

        $this->clearLoginAttempts($email);

        Auth::guard('web')->login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        $user = $this->users->updateLastLogin($user, $request->ip() ?? '');
        $this->logAudit($user, AuditAction::Login, $request);

        return [
            'user' => $user->load(['roles.permissions', 'jobSeekerProfile', 'employerUsers.company']),
        ];
    }

    public function loginRegisteredUser(User $user, Request $request): User
    {
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return $this->users->updateLastLogin($user, $request->ip() ?? '')
            ->load(['roles.permissions', 'jobSeekerProfile', 'employerUsers.company']);
    }

    public function logout(Request $request): void
    {
        $user = $request->user();

        if ($user) {
            $this->logAudit($user, AuditAction::Logout, $request);
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): User
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        return $this->users->update($user, [
            'password' => $newPassword,
        ]);
    }

    public function me(User $user): User
    {
        return $user->load([
            'roles.permissions',
            'permissions',
            'jobSeekerProfile',
            'employerUsers.company',
        ]);
    }

    private function createEmployerRecords(User $user, string $companyName): void
    {
        $slug = $this->generateUniqueCompanySlug($companyName);

        $company = Company::query()->create([
            'name' => $companyName,
            'slug' => $slug,
            'created_by' => $user->id,
        ]);

        EmployerUser::query()->create([
            'user_id' => $user->id,
            'company_id' => $company->id,
            'is_primary' => true,
            'is_active' => true,
            'joined_at' => now(),
        ]);
    }

    private function generateUniqueCompanySlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Company::query()->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function handleFailedLogin(string $email): never
    {
        $key = self::LOCKOUT_CACHE_PREFIX.$email;
        $attempts = (int) Cache::get($key, 0) + 1;
        $maxAttempts = config('talentbridge.security.max_login_attempts', 5);
        $lockoutMinutes = config('talentbridge.security.lockout_minutes', 15);

        Cache::put($key, $attempts, now()->addMinutes($lockoutMinutes));

        if ($attempts >= $maxAttempts) {
            throw ValidationException::withMessages([
                'email' => ['Too many login attempts. Please try again later.'],
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    private function clearLoginAttempts(string $email): void
    {
        Cache::forget(self::LOCKOUT_CACHE_PREFIX.$email);
    }

    private function logAudit(User $user, AuditAction $action, Request $request): void
    {
        AuditLog::query()->create([
            'user_id' => $user->id,
            'action' => $action,
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }
}
