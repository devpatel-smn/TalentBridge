<?php

namespace App\Modules\JobSeeker\Repositories;

use App\Models\Education;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\EducationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EducationRepository implements EducationRepositoryInterface
{
    public function findForProfile(int $profileId, int $educationId): ?Education
    {
        return Education::query()
            ->where('job_seeker_profile_id', $profileId)
            ->find($educationId);
    }

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        $query = Education::query()
            ->where('job_seeker_profile_id', $profileId);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where(function ($builder) use ($search) {
                $builder->where('institution', 'ilike', $search)
                    ->orWhere('degree', 'ilike', $search)
                    ->orWhere('field_of_study', 'ilike', $search);
            });
        }

        $sort = in_array($params->sort, ['started_at', 'ended_at', 'sort_order', 'created_at'], true)
            ? $params->sort
            : 'sort_order';

        return $query
            ->orderBy($sort, $params->order)
            ->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function create(int $profileId, array $attributes): Education
    {
        return Education::query()->create([
            'job_seeker_profile_id' => $profileId,
            ...$attributes,
        ]);
    }

    public function update(Education $education, array $attributes): Education
    {
        $education->update($attributes);

        return $education->fresh();
    }

    public function delete(Education $education): void
    {
        $education->delete();
    }

    public function countForProfile(int $profileId): int
    {
        return Education::query()
            ->where('job_seeker_profile_id', $profileId)
            ->count();
    }
}
