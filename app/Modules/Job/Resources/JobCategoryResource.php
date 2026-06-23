<?php

namespace App\Modules\Job\Resources;

use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin JobCategory
 */
class JobCategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sort_order' => $this->sort_order,
            'children' => $this->whenLoaded('children', fn () => JobCategoryResource::collection($this->children)),
        ];
    }
}
