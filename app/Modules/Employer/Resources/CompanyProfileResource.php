<?php

namespace App\Modules\Employer\Resources;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Company
 */
class CompanyProfileResource extends JsonResource
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
            'logo' => $this->whenLoaded('logo', fn () => $this->logo ? [
                'uuid' => $this->logo->uuid,
                'original_name' => $this->logo->original_name,
                'mime_type' => $this->logo->mime_type,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
