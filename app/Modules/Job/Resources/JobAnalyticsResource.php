<?php

namespace App\Modules\Job\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobAnalyticsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'job_uuid' => $this->resource['job_uuid'],
            'title' => $this->resource['title'],
            'status' => $this->resource['status'],
            'views_count' => $this->resource['views_count'],
            'applications_count' => $this->resource['applications_count'],
            'application_rate' => $this->resource['application_rate'],
            'published_at' => $this->resource['published_at'],
            'closed_at' => $this->resource['closed_at'],
            'days_published' => $this->resource['days_published'],
            'is_featured' => $this->resource['is_featured'],
            'vacancies' => $this->resource['vacancies'],
            'status_breakdown' => $this->resource['status_breakdown'],
        ];
    }
}
