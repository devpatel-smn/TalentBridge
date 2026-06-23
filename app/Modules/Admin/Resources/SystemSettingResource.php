<?php

namespace App\Modules\Admin\Resources;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SystemSetting
 */
class SystemSettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'value' => $this->value,
            'group' => $this->group,
            'description' => $this->description,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
