<?php

namespace App\Modules\Application\Resources;

use App\Models\JobApplication;
use App\Modules\Job\Resources\JobResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin JobApplication
 */
class JobApplicationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $canViewEmployerNotes = $user && ($user->isAdmin()
            || ($user->isEmployer() && $user->belongsToCompany($this->job?->company_id)));

        return [
            'uuid' => $this->uuid,
            'status' => $this->status->value,
            'cover_letter' => $this->cover_letter,
            'rejection_reason' => $this->rejection_reason,
            'applied_at' => $this->applied_at?->toIso8601String(),
            'status_changed_at' => $this->status_changed_at?->toIso8601String(),
            'can_withdraw' => $user?->isJobSeeker() && ! in_array($this->status->value, [
                'withdrawn',
                'rejected',
                'hired',
            ], true),
            'employer_notes' => $this->when($canViewEmployerNotes, $this->employer_notes),
            'job' => $this->whenLoaded('job', fn () => new JobResource($this->job)),
            'resume' => $this->whenLoaded('resume', fn () => $this->resume ? [
                'uuid' => $this->resume->uuid,
                'title' => $this->resume->title,
                'source' => $this->resume->source,
                'file_id' => $this->resume->file_id,
            ] : null),
            'candidate' => $this->whenLoaded('jobSeekerProfile', fn () => [
                'profile_uuid' => $this->jobSeekerProfile->uuid,
                'headline' => $this->jobSeekerProfile->headline,
                'current_title' => $this->jobSeekerProfile->current_title,
                'years_of_experience' => $this->jobSeekerProfile->years_of_experience,
                'location_city' => $this->jobSeekerProfile->location_city,
                'location_state' => $this->jobSeekerProfile->location_state,
                'location_country' => $this->jobSeekerProfile->location_country,
                'user' => $this->jobSeekerProfile->relationLoaded('user') && $this->jobSeekerProfile->user ? [
                    'uuid' => $this->jobSeekerProfile->user->uuid,
                    'full_name' => $this->jobSeekerProfile->user->full_name,
                    'email' => $this->jobSeekerProfile->user->email,
                ] : null,
            ]),
            'status_history' => $this->whenLoaded(
                'statusHistories',
                fn () => ApplicationStatusHistoryResource::collection($this->statusHistories)
            ),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
