<?php

namespace App\Modules\Admin\Resources;

use App\Models\CompanyVerification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CompanyVerification
 */
class VerificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'business_registration_number' => $this->business_registration_number,
            'tax_id' => $this->tax_id,
            'documents' => $this->documents,
            'notes' => $this->notes,
            'reviewer_notes' => $this->reviewer_notes,
            'rejection_reason' => $this->rejection_reason,
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'company' => $this->whenLoaded('company', fn () => new CompanyResource($this->company)),
            'submitter' => $this->whenLoaded('submitter', fn () => new AdminUserResource($this->submitter)),
            'reviewer' => $this->whenLoaded('reviewer', fn () => $this->reviewer
                ? new AdminUserResource($this->reviewer)
                : null),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
