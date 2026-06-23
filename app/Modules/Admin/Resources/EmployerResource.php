<?php

namespace App\Modules\Admin\Resources;

use App\Models\EmployerUser;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin EmployerUser
 */
class EmployerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_title' => $this->job_title,
            'is_primary' => $this->is_primary,
            'is_active' => $this->is_active,
            'joined_at' => $this->joined_at?->toIso8601String(),
            'user' => $this->whenLoaded('user', fn () => new AdminUserResource($this->user)),
            'company' => $this->whenLoaded('company', fn () => new CompanyResource($this->company)),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
