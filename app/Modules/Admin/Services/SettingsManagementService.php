<?php

namespace App\Modules\Admin\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\SystemSetting;
use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminSystemSettingRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SettingsManagementService
{
    public function __construct(
        private readonly AdminSystemSettingRepositoryInterface $settings,
    ) {}

    /**
     * @return Collection<int, SystemSetting>
     */
    public function all(): Collection
    {
        return $this->settings->all();
    }

    /**
     * @param  list<array{key: string, value: array<string, mixed>, group?: string, description?: string|null}>  $settings
     * @return Collection<int, SystemSetting>
     */
    public function updateMany(array $settings, User $actor, Request $request): Collection
    {
        return DB::transaction(function () use ($settings, $actor, $request) {
            $updated = collect();

            foreach ($settings as $setting) {
                $record = $this->settings->upsert(
                    $setting['key'],
                    $setting['value'],
                    $setting['group'] ?? SystemSetting::GROUP_GENERAL,
                    $setting['description'] ?? null,
                    $actor->id,
                );

                $updated->push($record);
            }

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => SystemSetting::class,
                'auditable_id' => 0,
                'new_values' => ['keys' => collect($settings)->pluck('key')->all()],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $updated;
        });
    }
}
