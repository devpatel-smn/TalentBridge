<?php

namespace App\Modules\JobSeeker\Resources;

use App\Models\SavedJob;
use App\Modules\Job\Resources\JobResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SavedJob
 */
class SavedJobResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'saved_at' => $this->created_at?->toIso8601String(),
            'job' => $this->whenLoaded('job', fn () => new JobResource($this->job)),
        ];
    }
}
