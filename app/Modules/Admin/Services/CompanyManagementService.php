<?php

namespace App\Modules\Admin\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminCompanyRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CompanyManagementService
{
    public function __construct(
        private readonly AdminCompanyRepositoryInterface $companies,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->companies->paginate($params);
    }

    public function find(string $uuid): Company
    {
        return $this->companies->findByUuid($uuid)
            ?? throw ValidationException::withMessages(['uuid' => ['Company not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Company $company, array $data, User $actor, Request $request): Company
    {
        return DB::transaction(function () use ($company, $data, $actor, $request) {
            $oldValues = $company->only([
                'name', 'description', 'website', 'industry', 'company_size',
                'founded_year', 'headquarters', 'verification_status', 'social_links',
            ]);

            $attributes = array_filter([
                'name' => $data['name'] ?? null,
                'description' => $data['description'] ?? null,
                'website' => $data['website'] ?? null,
                'industry' => $data['industry'] ?? null,
                'company_size' => $data['company_size'] ?? null,
                'founded_year' => $data['founded_year'] ?? null,
                'headquarters' => $data['headquarters'] ?? null,
                'social_links' => $data['social_links'] ?? null,
                'updated_by' => $actor->id,
            ], fn ($value) => $value !== null);

            $company = $this->companies->update($company, $attributes);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Company::class,
                'auditable_id' => $company->id,
                'old_values' => $oldValues,
                'new_values' => $attributes,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $company;
        });
    }

    public function delete(Company $company, User $actor, Request $request): void
    {
        if ($company->jobs()->whereNull('deleted_at')->exists()) {
            throw ValidationException::withMessages([
                'company' => ['Cannot delete a company with active jobs.'],
            ]);
        }

        DB::transaction(function () use ($company, $actor, $request): void {
            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => Company::class,
                'auditable_id' => $company->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->companies->delete($company);
        });
    }
}
