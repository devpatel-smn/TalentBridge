<?php

namespace App\Modules\Admin\Repositories;

use App\Models\SystemSetting;
use App\Modules\Admin\Repositories\Contracts\AdminSystemSettingRepositoryInterface;
use Illuminate\Support\Collection;

class AdminSystemSettingRepository implements AdminSystemSettingRepositoryInterface
{
    public function all(): Collection
    {
        return SystemSetting::query()->orderBy('group')->orderBy('key')->get();
    }

    public function findByKey(string $key): ?SystemSetting
    {
        return SystemSetting::query()->where('key', $key)->first();
    }

    public function upsert(string $key, array $value, string $group, ?string $description, int $updatedBy): SystemSetting
    {
        return SystemSetting::query()->updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'description' => $description,
                'updated_by' => $updatedBy,
            ]
        );
    }
}
