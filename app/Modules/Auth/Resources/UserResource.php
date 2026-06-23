<?php

namespace App\Modules\Auth\Resources;

use App\Models\EmployerUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status->value,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'timezone' => $this->timezone,
            'locale' => $this->locale,
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'roles' => $this->roles->pluck('name')->values(),
            'permissions' => $this->getAllPermissions()->pluck('name')->values(),
            'job_seeker_profile' => $this->when(
                $this->relationLoaded('jobSeekerProfile') && $this->jobSeekerProfile,
                fn () => [
                    'uuid' => $this->jobSeekerProfile->uuid,
                    'profile_completion' => $this->jobSeekerProfile->profile_completion,
                ]
            ),
            'employer_context' => $this->when(
                $this->relationLoaded('employerUsers'),
                fn () => $this->employerUsers->map(fn (EmployerUser $membership) => [
                    'company_id' => $membership->company_id,
                    'company_uuid' => $membership->company?->uuid,
                    'company_name' => $membership->company?->name,
                    'company_slug' => $membership->company?->slug,
                    'is_primary' => $membership->is_primary,
                    'is_active' => $membership->is_active,
                ])->values()
            ),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
