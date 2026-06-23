<?php

namespace App\Modules\Admin\Resources;

use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Interview
 */
class InterviewResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'interview_type' => $this->interview_type->value,
            'status' => $this->status->value,
            'title' => $this->title,
            'scheduled_at' => $this->scheduled_at->toIso8601String(),
            'duration_minutes' => $this->duration_minutes,
            'timezone' => $this->timezone,
            'location' => $this->location,
            'meeting_link' => $this->meeting_link,
            'instructions' => $this->instructions,
            'feedback' => $this->feedback,
            'rating' => $this->rating,
            'completed_at' => $this->completed_at?->toIso8601String(),
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'cancellation_reason' => $this->cancellation_reason,
            'company' => $this->whenLoaded('company', fn () => new CompanyResource($this->company)),
            'scheduler' => $this->whenLoaded('scheduler', fn () => new AdminUserResource($this->scheduler)),
            'job_application' => $this->whenLoaded('jobApplication', function () {
                $application = $this->jobApplication;

                return [
                    'uuid' => $application->uuid,
                    'status' => $application->status->value,
                    'job' => $application->relationLoaded('job') && $application->job
                        ? new JobResource($application->job)
                        : null,
                    'candidate' => $application->relationLoaded('jobSeekerProfile') && $application->jobSeekerProfile
                        ? new JobSeekerResource($application->jobSeekerProfile)
                        : null,
                ];
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
