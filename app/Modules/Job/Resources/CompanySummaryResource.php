<?php

namespace App\Modules\Job\Resources;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Company
 */
class CompanySummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'slug' => $this->slug,
            'industry' => $this->industry,
            'headquarters' => $this->headquarters,
            'verification_status' => $this->verification_status->value,
            'logo' => $this->whenLoaded('logo', fn () => $this->logo ? [
                'uuid' => $this->logo->uuid,
                'original_name' => $this->logo->original_name,
            ] : null),
        ];
    }
}
