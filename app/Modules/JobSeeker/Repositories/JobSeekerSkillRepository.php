<?php

namespace App\Modules\JobSeeker\Repositories;

use App\Models\JobSeekerSkill;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerSkillRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class JobSeekerSkillRepository implements JobSeekerSkillRepositoryInterface
{
    public function findForProfile(int $profileId, int $jobSeekerSkillId): ?JobSeekerSkill
    {
        return JobSeekerSkill::query()
            ->with('skill')
            ->where('job_seeker_profile_id', $profileId)
            ->find($jobSeekerSkillId);
    }

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        $query = JobSeekerSkill::query()
            ->with('skill')
            ->where('job_seeker_profile_id', $profileId);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->whereHas('skill', fn ($builder) => $builder->where('name', 'ilike', $search));
        }

        $sort = $params->sort === 'name' ? 'skills.name' : 'job_seeker_skills.created_at';

        if ($sort === 'skills.name') {
            $query->join('skills', 'skills.id', '=', 'job_seeker_skills.skill_id')
                ->select('job_seeker_skills.*')
                ->orderBy('skills.name', $params->order);
        } else {
            $query->orderBy('job_seeker_skills.created_at', $params->order);
        }

        return $query->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function allForProfile(int $profileId): Collection
    {
        return JobSeekerSkill::query()
            ->with('skill')
            ->where('job_seeker_profile_id', $profileId)
            ->get();
    }

    public function create(int $profileId, array $attributes): JobSeekerSkill
    {
        return JobSeekerSkill::query()->create([
            'job_seeker_profile_id' => $profileId,
            ...$attributes,
        ])->load('skill');
    }

    public function delete(JobSeekerSkill $jobSeekerSkill): void
    {
        $jobSeekerSkill->delete();
    }

    public function countForProfile(int $profileId): int
    {
        return JobSeekerSkill::query()
            ->where('job_seeker_profile_id', $profileId)
            ->count();
    }

    public function existsForProfile(int $profileId, int $skillId): bool
    {
        return JobSeekerSkill::query()
            ->where('job_seeker_profile_id', $profileId)
            ->where('skill_id', $skillId)
            ->exists();
    }
}
