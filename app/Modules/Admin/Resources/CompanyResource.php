<?php

namespace App\Modules\Admin\Resources;

use App\Models\Company;
use App\Models\EmployerUser;
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
            'creator' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'full_name' => $this->creator->full_name,
                'email' => $this->creator->email,
            ]),
            'verifier' => $this->whenLoaded('verifier', fn () => $this->verifier ? [
                'id' => $this->verifier->id,
                'full_name' => $this->verifier->full_name,
                'email' => $this->verifier->email,
            ] : null),
            'team' => $this->whenLoaded('employerUsers', fn () => $this->employerUsers->map(
                fn (EmployerUser $membership) => [
                    'id' => $membership->id,
                    'job_title' => $membership->job_title,
                    'is_primary' => $membership->is_primary,
                    'is_active' => $membership->is_active,
                    'joined_at' => $membership->joined_at?->toIso8601String(),
                    'user' => $membership->relationLoaded('user') && $membership->user ? [
                        'id' => $membership->user->id,
                        'full_name' => $membership->user->full_name,
                        'email' => $membership->user->email,
                        'status' => $membership->user->status->value,
                    ] : null,
                ]
            )->values()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
