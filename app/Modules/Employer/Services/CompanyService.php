<?php

namespace App\Modules\Employer\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\User;
use App\Modules\Employer\Repositories\Contracts\EmployerCompanyRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CompanyService
{
    public function __construct(
        private readonly EmployerCompanyRepositoryInterface $companies,
    ) {}

    public function getProfile(int $companyId): Company
    {
        return $this->companies->findById($companyId)
            ?? throw ValidationException::withMessages(['company' => ['Company not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(Company $company, array $data, User $actor, Request $request): Company
    {
        return DB::transaction(function () use ($company, $data, $actor, $request) {
            $oldValues = $company->only([
                'name', 'description', 'website', 'industry', 'company_size',
                'founded_year', 'headquarters', 'social_links', 'logo_file_id',
            ]);

            $updates = ['updated_by' => $actor->id];

            foreach (['description', 'website', 'industry', 'company_size', 'founded_year', 'headquarters', 'social_links', 'logo_file_id'] as $field) {
                if (array_key_exists($field, $data)) {
                    $updates[$field] = $data[$field];
                }
            }

            if (array_key_exists('name', $data) && $data['name'] !== null) {
                $updates['name'] = $data['name'];
                $updates['slug'] = $this->generateUniqueSlug($data['name'], $company->id);
            }

            $company = $this->companies->update($company, $updates);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Company::class,
                'auditable_id' => $company->id,
                'old_values' => $oldValues,
                'new_values' => $updates,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $company;
        });
    }

    private function generateUniqueSlug(string $name, int $excludeCompanyId): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Company::query()
            ->where('slug', $slug)
            ->where('id', '!=', $excludeCompanyId)
            ->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
