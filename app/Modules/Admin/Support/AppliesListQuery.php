<?php

namespace App\Modules\Admin\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait AppliesListQuery
{
    /**
     * @param  Builder<Model>  $query
     * @param  list<string>  $searchableColumns
     * @param  list<string>  $sortableColumns
     * @return Builder<Model>
     */
    protected function applyListQuery(
        Builder $query,
        ListQueryParams $params,
        array $searchableColumns,
        array $sortableColumns,
        string $defaultSort = 'created_at',
    ): Builder {
        if ($params->search !== null && $params->search !== '' && $searchableColumns !== []) {
            $search = '%'.$params->search.'%';

            $query->where(function (Builder $builder) use ($searchableColumns, $search): void {
                foreach ($searchableColumns as $column) {
                    $builder->orWhere($column, 'ilike', $search);
                }
            });
        }

        foreach ($params->filters as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            if (is_array($value)) {
                $query->whereIn($field, $value);

                continue;
            }

            $query->where($field, $value);
        }

        $sort = in_array($params->sort, $sortableColumns, true)
            ? $params->sort
            : $defaultSort;

        $query->orderBy($sort, $params->order);

        return $query;
    }
}
