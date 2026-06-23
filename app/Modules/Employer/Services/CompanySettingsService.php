<?php

namespace App\Modules\Employer\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\User;
use App\Modules\Employer\Repositories\Contracts\EmployerCompanyRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanySettingsService
{
    /**
     * @var list<string>
     */
    private const ALLOWED_KEYS = [
        'subscription_tier',
        'default_timezone',
        'application_notifications',
        'public_profile_enabled',
        'branding',
    ];

    public function __construct(
        private readonly EmployerCompanyRepositoryInterface $companies,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getSettings(int $companyId): array
    {
        $company = $this->companies->findById($companyId);

        return $this->normalizeSettings($company?->settings ?? []);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateSettings(Company $company, array $data, User $actor, Request $request): array
    {
        return DB::transaction(function () use ($company, $data, $actor, $request) {
            $oldSettings = $company->settings ?? [];
            $newSettings = array_merge($oldSettings, array_intersect_key($data, array_flip(self::ALLOWED_KEYS)));

            $company = $this->companies->update($company, [
                'settings' => $newSettings,
                'updated_by' => $actor->id,
            ]);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Company::class,
                'auditable_id' => $company->id,
                'old_values' => ['settings' => $oldSettings],
                'new_values' => ['settings' => $newSettings],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $this->normalizeSettings($company->settings ?? []);
        });
    }

    /**
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    private function normalizeSettings(array $settings): array
    {
        return array_merge([
            'subscription_tier' => 'free',
            'default_timezone' => 'UTC',
            'application_notifications' => true,
            'public_profile_enabled' => true,
            'branding' => null,
        ], $settings);
    }
}
