<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\SystemSetting;
use Illuminate\Support\Collection;

interface AdminSystemSettingRepositoryInterface
{
    /**
     * @return Collection<int, SystemSetting>
     */
    public function all(): Collection;

    public function findByKey(string $key): ?SystemSetting;

    public function upsert(string $key, array $value, string $group, ?string $description, int $updatedBy): SystemSetting;
}
