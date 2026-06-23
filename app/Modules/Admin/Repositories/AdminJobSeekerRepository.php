<?php

namespace App\Modules\Admin\Repositories;

use App\Models\JobSeekerProfile;
use App\Modules\Admin\Repositories\Contracts\AdminJobSeekerRepositoryInterface;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminJobSeekerRepository implements AdminJobSeekerRepositoryInterface
{
    use AppliesListQuery;

    public function paginate(ListQueryParams $params): LengthAwarePaginator
    {
        $query = JobSeekerProfile::query()->with(['user']);

        if (in_array('skills', $params->includes, true)) {
            $query->with('skills');
        }

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('headline', 'ilike', $search)
                    ->orWhere('current_title', 'ilike', $search)
                    ->orWhere('location_city', 'ilike', $search)
                    ->orWhereHas('user', function ($userQuery) use ($search): void {
                        $userQuery->where('first_name', 'ilike', $search)
                            ->orWhere('last_name', 'ilike', $search)
                            ->orWhere('email', 'ilike', $search);
                    });
            });
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'profile_completion', 'created_at', 'years_of_experience'],
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findByUuid(string $uuid): ?JobSeekerProfile
    {
        return JobSeekerProfile::query()
            ->with(['user.roles', 'skills', 'experiences', 'educations', 'resumes'])
            ->where('uuid', $uuid)
            ->first();
    }
}
