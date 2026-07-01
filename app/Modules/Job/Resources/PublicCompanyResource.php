<?php

namespace App\Modules\Job\Resources;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Company
 */
class PublicCompanyResource extends JsonResource
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
            'open_jobs_count' => $this->open_jobs_count ?? $this->whenCounted('jobs'),
            'logo' => $this->whenLoaded('logo', fn () => $this->logo ? [
                'uuid' => $this->logo->uuid,
                'original_name' => $this->logo->original_name,
            ] : null),
        ];
    }
}
