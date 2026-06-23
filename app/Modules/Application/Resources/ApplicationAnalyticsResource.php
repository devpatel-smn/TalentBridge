<?php

namespace App\Modules\Application\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationAnalyticsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'job' => $this->resource['job'] ?? null,
            'totals' => $this->resource['totals'] ?? [],
            'rates' => $this->resource['rates'] ?? [],
            'average_hours_to_review' => $this->resource['average_hours_to_review'] ?? null,
            'timeline' => $this->resource['timeline'] ?? [],
            'by_status' => $this->resource['by_status'] ?? [],
        ];
    }
}
