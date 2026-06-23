<?php

namespace App\Modules\Admin\Resources;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Company
 */
class CompanyResource extends JsonResource
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
            'description' => $this->description,
            'website' => $this->website,
            'industry' => $this->industry,
            'company_size' => $this->company_size,
            'founded_year' => $this->founded_year,
            'headquarters' => $this->headquarters,
            'verification_status' => $this->verification_status->value,
            'verified_at' => $this->verified_at?->toIso8601String(),
            'social_links' => $this->social_links,
            'jobs_count' => $this->whenCounted('jobs'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
