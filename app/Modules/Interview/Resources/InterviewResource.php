<?php

namespace App\Modules\Interview\Resources;

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
        $isEmployerOrAdmin = $request->user()?->isEmployer() || $request->user()?->isAdmin();

        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'interview_type' => $this->interview_type->value,
            'status' => $this->status->value,
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'duration_minutes' => $this->duration_minutes,
            'timezone' => $this->timezone,
            'location' => $this->location,
            'meeting_link' => $this->meeting_link,
            'instructions' => $this->instructions,
            'feedback' => $this->when($isEmployerOrAdmin, $this->feedback),
            'rating' => $this->when($isEmployerOrAdmin, $this->rating),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'cancellation_reason' => $this->when($isEmployerOrAdmin, $this->cancellation_reason),
            'company' => $this->whenLoaded('company', fn () => [
                'uuid' => $this->company?->uuid,
                'name' => $this->company?->name,
                'slug' => $this->company?->slug,
            ]),
            'job_application' => $this->whenLoaded('jobApplication', function () use ($isEmployerOrAdmin) {
                $application = $this->jobApplication;

                if (! $application) {
                    return null;
                }

                return [
                    'uuid' => $application->uuid,
                    'status' => $application->status->value,
                    'job' => $application->relationLoaded('job') && $application->job ? [
                        'uuid' => $application->job->uuid,
                        'title' => $application->job->title,
                    ] : null,
                    'candidate' => $isEmployerOrAdmin && $application->relationLoaded('jobSeekerProfile') && $application->jobSeekerProfile
                        ? [
                            'uuid' => $application->jobSeekerProfile->uuid,
                            'headline' => $application->jobSeekerProfile->headline,
                            'user' => $application->jobSeekerProfile->relationLoaded('user') && $application->jobSeekerProfile->user ? [
                                'uuid' => $application->jobSeekerProfile->user->uuid,
                                'full_name' => $application->jobSeekerProfile->user->full_name,
                                'email' => $application->jobSeekerProfile->user->email,
                            ] : null,
                        ]
                        : null,
                ];
            }),
            'scheduler' => $this->when($isEmployerOrAdmin, fn () => $this->whenLoaded('scheduler', fn () => $this->scheduler ? [
                'uuid' => $this->scheduler->uuid,
                'full_name' => $this->scheduler->full_name,
            ] : null)),
            'participants' => InterviewParticipantResource::collection($this->whenLoaded('participants')),
            'status_history' => InterviewStatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
