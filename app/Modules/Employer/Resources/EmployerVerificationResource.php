<?php

namespace App\Modules\Employer\Resources;

use App\Models\CompanyVerification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CompanyVerification
 */
class EmployerVerificationResource extends JsonResource
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
            'rejection_reason' => $this->rejection_reason,
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
