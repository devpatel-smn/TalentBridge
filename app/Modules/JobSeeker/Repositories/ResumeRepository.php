<?php

namespace App\Modules\JobSeeker\Repositories;

use App\Models\Resume;
use App\Models\ResumeSection;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\ResumeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ResumeRepository implements ResumeRepositoryInterface
{
    public function findForProfile(int $profileId, string $uuid): ?Resume
    {
        return Resume::query()
            ->with(['sections', 'file'])
            ->where('job_seeker_profile_id', $profileId)
            ->where('uuid', $uuid)
            ->first();
    }

    public function listForProfile(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        $query = Resume::query()
            ->with('file')
            ->where('job_seeker_profile_id', $profileId);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->where('title', 'ilike', $search);
        }

        if (isset($params->filters['source'])) {
            $query->where('source', $params->filters['source']);
        }

        $sort = in_array($params->sort, ['title', 'created_at', 'updated_at'], true)
            ? $params->sort
            : 'created_at';

        return $query
            ->orderBy($sort, $params->order)
            ->paginate($params->perPage, ['*'], 'page', $params->page);
    }

    public function create(int $profileId, array $attributes): Resume
    {
        return Resume::query()->create([
            'job_seeker_profile_id' => $profileId,
            ...$attributes,
        ])->load(['sections', 'file']);
    }

    public function update(Resume $resume, array $attributes): Resume
    {
        $resume->update($attributes);

        return $resume->fresh(['sections', 'file']);
    }

    public function delete(Resume $resume): void
    {
        $resume->delete();
    }

    public function clearPrimaryForProfile(int $profileId, ?int $exceptResumeId = null): void
    {
        Resume::query()
            ->where('job_seeker_profile_id', $profileId)
            ->when($exceptResumeId, fn ($query) => $query->where('id', '!=', $exceptResumeId))
            ->update(['is_primary' => false]);
    }

    public function countForProfile(int $profileId): int
    {
        return Resume::query()
            ->where('job_seeker_profile_id', $profileId)
            ->count();
    }

    public function hasResumeForProfile(int $profileId): bool
    {
        return Resume::query()
            ->where('job_seeker_profile_id', $profileId)
            ->exists();
    }

    public function syncSections(Resume $resume, array $sections): Collection
    {
        $resume->sections()->delete();

        $created = collect();

        foreach ($sections as $index => $section) {
            $created->push(ResumeSection::query()->create([
                'resume_id' => $resume->id,
                'section_type' => $section['section_type'],
                'title' => $section['title'] ?? null,
                'content' => $section['content'],
                'sort_order' => $section['sort_order'] ?? $index,
                'is_visible' => $section['is_visible'] ?? true,
            ]));
        }

        return $created;
    }
}
