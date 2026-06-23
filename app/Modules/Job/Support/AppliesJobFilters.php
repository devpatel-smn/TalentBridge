<?php

namespace App\Modules\Job\Support;

use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\WorkMode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait AppliesJobFilters
{
    /**
     * @param  Builder<Model>  $query
     * @param  list<string>  $sortableColumns
     * @return Builder<Model>
     */
    protected function applyJobFilters(
        Builder $query,
        JobListQueryParams $params,
        array $sortableColumns,
        string $defaultSort = 'published_at',
    ): Builder {
        if ($params->search !== null && $params->search !== '') {
            $search = $params->search;
            $query->whereRaw(
                "to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(requirements, '')) @@ plainto_tsquery('english', ?)",
                [$search]
            );
        }

        foreach ($params->filters as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            match ($field) {
                'category_id', 'company_id', 'experience_level' => $query->where($field, $value),
                'employment_type' => $query->where('employment_type', EmploymentType::from((string) $value)),
                'work_mode' => $query->where('work_mode', WorkMode::from((string) $value)),
                'status' => $query->where('status', JobStatus::from((string) $value)),
                'location_city', 'location_state', 'location_country' => $query->where($field, 'ilike', (string) $value),
                'is_featured' => $query->where('is_featured', filter_var($value, FILTER_VALIDATE_BOOLEAN)),
                'salary_min' => $query->where('salary_max', '>=', $value),
                'salary_max' => $query->where('salary_min', '<=', $value),
                default => is_array($value)
                    ? $query->whereIn($field, $value)
                    : $query->where($field, $value),
            };
        }

        $sort = in_array($params->sort, $sortableColumns, true)
            ? $params->sort
            : $defaultSort;

        $query->orderBy($sort, $params->order);

        return $query;
    }
}
