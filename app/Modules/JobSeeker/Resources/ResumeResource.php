<?php

namespace App\Modules\JobSeeker\Resources;

use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Resume
 */
class ResumeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'template_key' => $this->template_key,
            'is_primary' => $this->is_primary,
            'source' => $this->source,
            'metadata' => $this->metadata,
            'file' => $this->whenLoaded('file', fn () => $this->file ? [
                'uuid' => $this->file->uuid,
                'original_name' => $this->file->original_name,
                'mime_type' => $this->file->mime_type,
                'size_bytes' => $this->file->size_bytes,
            ] : null),
            'sections' => ResumeSectionResource::collection($this->whenLoaded('sections')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
