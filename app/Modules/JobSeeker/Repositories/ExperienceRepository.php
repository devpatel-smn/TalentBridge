<?php

namespace App\Modules\JobSeeker\Repositories;

use App\Models\Experience;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\ExperienceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExperienceRepository implements ExperienceRepositoryInterface
{
    public function findForProfile(int $profileId, int $experienceId): ?Experience
    {
        return Experience::query()
            ->where('job_seeker_profile_id', $profileId)
            ->find($experienceId);
    }

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        $query = Experience::query()
            ->where('job_seeker_profile_id', $profileId);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search) {
                $builder->where('company_name', 'ilike', $search)
                    ->orWhere('job_title', 'ilike', $search)
                    ->orWhere('location', 'ilike', $search);
            });
        }

        $sort = in_array($params->sort, ['started_at', 'ended_at', 'sort_order', 'created_at'], true)
            ? $params->sort
            : 'sort_order';

        return $query
            ->orderBy($sort, $params->order)
            ->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function create(int $profileId, array $attributes): Experience
    {
        return Experience::query()->create([
            'job_seeker_profile_id' => $profileId,
            ...$attributes,
        ]);
    }

    public function update(Experience $experience, array $attributes): Experience
    {
        $experience->update($attributes);

        return $experience->fresh();
    }

    public function delete(Experience $experience): void
    {
        $experience->delete();
    }

    public function countForProfile(int $profileId): int
    {
        return Experience::query()
            ->where('job_seeker_profile_id', $profileId)
            ->count();
    }
}
