<?php

namespace App\Modules\Job\Resources;

use App\Models\Job;
use Illuminate\Http\Request;

/**
 * @mixin Job
 */
class JobDetailResource extends JobResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isOwner = $request->user()
            && ($request->user()->isAdmin() || $request->user()->belongsToCompany($this->company_id));

        return array_merge(parent::toArray($request), [
            'description' => $this->description,
            'requirements' => $this->requirements,
            'responsibilities' => $this->responsibilities,
            'benefits' => $this->benefits,
            'views_count' => $this->when($isOwner, $this->views_count),
            'applications_count' => $this->when($isOwner, $this->applications_count),
            'closed_at' => $this->closed_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'creator' => $this->whenLoaded('creator', fn () => $this->creator ? [
                'uuid' => $this->creator->uuid,
                'full_name' => $this->creator->full_name,
            ] : null),
        ]);
    }
}
