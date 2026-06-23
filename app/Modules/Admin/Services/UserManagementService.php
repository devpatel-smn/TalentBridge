<?php

namespace App\Modules\Admin\Services;

use App\Enums\AuditAction;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\EmployerUser;
use App\Models\JobSeekerProfile;
use App\Models\Role;
use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminUserRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserManagementService
{
    public function __construct(
        private readonly AdminUserRepositoryInterface $users,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->users->paginate($params);
    }

    public function find(int $id): User
    {
        return $this->users->findById($id)
            ?? throw ValidationException::withMessages(['id' => ['User not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, Request $request): User
    {
        return DB::transaction(function () use ($data, $request) {
            $user = $this->users->create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? UserStatus::Active,
                'timezone' => $data['timezone'] ?? 'UTC',
                'locale' => $data['locale'] ?? 'en',
                'email_verified_at' => ($data['email_verified'] ?? false) ? now() : null,
            ]);

            $role = $data['role'];
            $user->assignRole($role);

            if ($role === Role::EMPLOYER && ! empty($data['company_name'])) {
                $this->createEmployerRecords($user, $data['company_name']);
            }

            if ($role === Role::JOB_SEEKER) {
                JobSeekerProfile::query()->create(['user_id' => $user->id]);
            }

            $this->logAudit($request->user(), AuditAction::Created, $user, $request);

            return $user->load(['roles', 'jobSeekerProfile', 'employerUsers.company']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data, Request $request): User
    {
        return DB::transaction(function () use ($user, $data, $request) {
            $oldValues = $user->only(['first_name', 'last_name', 'email', 'phone', 'status', 'timezone', 'locale']);

            $attributes = array_filter([
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? null,
                'timezone' => $data['timezone'] ?? null,
                'locale' => $data['locale'] ?? null,
            ], fn ($value) => $value !== null);

            if (! empty($data['password'])) {
                $attributes['password'] = $data['password'];
            }

            $user = $this->users->update($user, $attributes);

            if (isset($data['role'])) {
                $user->syncRoles([$data['role']]);
            }

            $this->logAudit($request->user(), AuditAction::Updated, $user, $request, $oldValues, $attributes);

            return $user->load(['roles', 'jobSeekerProfile', 'employerUsers.company']);
        });
    }

    public function updateStatus(User $user, UserStatus $status, Request $request): User
    {
        if ($request->user()->id === $user->id) {
            throw ValidationException::withMessages([
                'status' => ['You cannot change your own account status.'],
            ]);
        }

        $oldStatus = $user->status;
        $user = $this->users->update($user, ['status' => $status]);

        $this->logAudit(
            $request->user(),
            AuditAction::Updated,
            $user,
            $request,
            ['status' => $oldStatus->value],
            ['status' => $status->value],
        );

        return $user;
    }

    public function delete(User $user, Request $request): void
    {
        if ($request->user()->id === $user->id) {
            throw ValidationException::withMessages([
                'id' => ['You cannot delete your own account.'],
            ]);
        }

        $this->logAudit($request->user(), AuditAction::Deleted, $user, $request);
        $this->users->delete($user);
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

    /**
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    private function logAudit(
        User $actor,
        AuditAction $action,
        User $target,
        Request $request,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        AuditLog::query()->create([
            'user_id' => $actor->id,
            'action' => $action,
            'auditable_type' => User::class,
            'auditable_id' => $target->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }
}
