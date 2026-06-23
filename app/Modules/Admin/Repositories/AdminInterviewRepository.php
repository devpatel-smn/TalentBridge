<?php

namespace App\Modules\Admin\Repositories;

use App\Models\Interview;
use App\Modules\Admin\Repositories\Contracts\AdminInterviewRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminInterviewRepository implements AdminInterviewRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = Interview::query()
            ->with([
                'company',
                'scheduler',
                'jobApplication.job',
                'jobApplication.jobSeekerProfile.user',
                'participants.user',
            ]);

        if (isset($params->filters['company_id'])) {
            $query->where('company_id', $params->filters['company_id']);
            unset($params->filters['company_id']);
        }

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('title', 'ilike', $search)
                    ->orWhere('location', 'ilike', $search)
                    ->orWhereHas('company', fn ($q) => $q->where('name', 'ilike', $search));
            });
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'scheduled_at', 'status', 'created_at'],
            'scheduled_at',
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findByUuid(string $uuid): ?Interview
    {
        return Interview::query()
            ->with([
                'company',
                'scheduler',
                'jobApplication.job',
                'jobApplication.jobSeekerProfile.user',
                'participants.user',
            ])
            ->where('uuid', $uuid)
            ->first();
    }
}
