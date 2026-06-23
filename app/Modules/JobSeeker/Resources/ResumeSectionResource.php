<?php

namespace App\Modules\JobSeeker\Resources;

use App\Models\ResumeSection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ResumeSection
 */
class ResumeSectionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'section_type' => $this->section_type,
            'title' => $this->title,
            'content' => $this->content,
            'sort_order' => $this->sort_order,
            'is_visible' => $this->is_visible,
        ];
    }
}
