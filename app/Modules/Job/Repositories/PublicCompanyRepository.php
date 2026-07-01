<?php

namespace App\Modules\Job\Repositories;

use App\Models\Company;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Job\Repositories\Contracts\PublicCompanyRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PublicCompanyRepository implements PublicCompanyRepositoryInterface
{
    private const SEARCHABLE = ['name', 'slug', 'industry', 'headquarters'];

    private const SORTABLE = ['name', 'created_at', 'open_jobs_count'];

    public function paginatePublic(ListQueryParams $params): LengthAwarePaginator
    {
        $query = Company::query()
            ->with('logo')
            ->withCount(['jobs as open_jobs_count' => fn ($builder) => $builder->active()]);

        $this->applyCompanyFilters($query, $params);

        if ($params->search !== null && $params->search !== '') {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                foreach (self::SEARCHABLE as $column) {
                    $builder->orWhere($column, 'ilike', $search);
                }
            });
        }

        $sort = in_array($params->sort, self::SORTABLE, true) ? $params->sort : 'name';
        $query->orderBy($sort, $params->order);

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findBySlug(string $slug): ?Company
    {
        return Company::query()
            ->with('logo')
            ->withCount(['jobs as open_jobs_count' => fn ($builder) => $builder->active()])
            ->where('slug', $slug)
            ->first();
    }

    public function distinctIndustries(): Collection
    {
        return Company::query()
            ->whereNotNull('industry')
            ->where('industry', '!=', '')
            ->distinct()
            ->orderBy('industry')
            ->pluck('industry');
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder<Company>  $query
     */
    private function applyCompanyFilters($query, ListQueryParams $params): void
    {
        foreach ($params->filters as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            match ($field) {
                'industry' => $query->where('industry', (string) $value),
                'headquarters' => $query->where('headquarters', 'ilike', '%'.(string) $value.'%'),
                'verification_status' => $query->where('verification_status', (string) $value),
                'company_size' => $query->where('company_size', (string) $value),
                default => null,
            };
        }
    }
}
