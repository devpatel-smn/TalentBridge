<?php

namespace App\Modules\Job\Services;

use App\Enums\AuditAction;
use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\WorkMode;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\Job;
use App\Models\User;
use App\Modules\Job\Repositories\Contracts\JobRepositoryInterface;
use App\Modules\Job\Support\JobListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class JobService
{
    public function __construct(
        private readonly JobRepositoryInterface $jobs,
    ) {}

    public function listForCompany(int $companyId, JobListQueryParams $params): LengthAwarePaginator
    {
        return $this->jobs->paginateForCompany($companyId, $params);
    }

    public function findForCompany(string $uuid, int $companyId): Job
    {
        return $this->jobs->findByUuid($uuid, $companyId)
            ?? throw ValidationException::withMessages(['uuid' => ['Job not found.']]);
    }

    public function findPublic(string $uuid): Job
    {
        $job = $this->jobs->findByUuid($uuid);

        if (! $job || $job->status !== JobStatus::Published) {
            throw ValidationException::withMessages(['uuid' => ['Job not found.']]);
        }

        return $job;
    }

    public function find(string $uuid): Job
    {
        return $this->jobs->findByUuid($uuid)
            ?? throw ValidationException::withMessages(['uuid' => ['Job not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $companyId, array $data, User $actor, Request $request): Job
    {
        return DB::transaction(function () use ($companyId, $data, $actor, $request) {
            $title = (string) $data['title'];
            $slug = $this->generateUniqueSlug($title, $companyId);

            $attributes = [
                'company_id' => $companyId,
                'category_id' => $data['category_id'] ?? null,
                'title' => $title,
                'slug' => $slug,
                'description' => $data['description'],
                'requirements' => $data['requirements'] ?? null,
                'responsibilities' => $data['responsibilities'] ?? null,
                'benefits' => $data['benefits'] ?? null,
                'employment_type' => EmploymentType::from($data['employment_type']),
                'work_mode' => WorkMode::from($data['work_mode']),
                'experience_level' => $data['experience_level'] ?? null,
                'salary_min' => $data['salary_min'] ?? null,
                'salary_max' => $data['salary_max'] ?? null,
                'salary_currency' => $data['salary_currency'] ?? 'USD',
                'salary_period' => $data['salary_period'] ?? 'yearly',
                'is_salary_visible' => $data['is_salary_visible'] ?? true,
                'location_city' => $data['location_city'] ?? null,
                'location_state' => $data['location_state'] ?? null,
                'location_country' => $data['location_country'] ?? null,
                'application_deadline' => $data['application_deadline'] ?? null,
                'vacancies' => $data['vacancies'] ?? 1,
                'is_featured' => false,
                'status' => JobStatus::Draft,
                'created_by' => $actor->id,
            ];

            $job = $this->jobs->create($attributes);

            if (! empty($data['skills'])) {
                $this->jobs->syncSkills($job, $this->normalizeSkills($data['skills']));
            }

            $this->logAudit($job, AuditAction::Created, $actor, $request, null, $attributes);
            $this->logActivity($job, $companyId, $actor, 'job.created', "Job draft \"{$job->title}\" created.");

            return $job->fresh(['company', 'category', 'skills', 'creator']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Job $job, array $data, User $actor, Request $request): Job
    {
        if ($job->status === JobStatus::Archived) {
            throw ValidationException::withMessages([
                'status' => ['Archived jobs cannot be edited.'],
            ]);
        }

        return DB::transaction(function () use ($job, $data, $actor, $request) {
            $oldValues = $job->only([
                'title', 'description', 'requirements', 'responsibilities', 'benefits',
                'employment_type', 'work_mode', 'experience_level', 'category_id',
                'salary_min', 'salary_max', 'vacancies', 'location_city', 'location_state',
                'location_country', 'application_deadline',
            ]);

            $attributes = ['updated_by' => $actor->id];

            $scalarFields = [
                'category_id', 'description', 'requirements', 'responsibilities', 'benefits',
                'experience_level', 'salary_min', 'salary_max', 'salary_currency', 'salary_period',
                'is_salary_visible', 'location_city', 'location_state', 'location_country',
                'application_deadline', 'vacancies',
            ];

            foreach ($scalarFields as $field) {
                if (array_key_exists($field, $data)) {
                    $attributes[$field] = $data[$field];
                }
            }

            if (array_key_exists('employment_type', $data) && $data['employment_type'] !== null) {
                $attributes['employment_type'] = EmploymentType::from($data['employment_type']);
            }

            if (array_key_exists('work_mode', $data) && $data['work_mode'] !== null) {
                $attributes['work_mode'] = WorkMode::from($data['work_mode']);
            }

            if (array_key_exists('title', $data) && $data['title'] !== null) {
                $attributes['title'] = $data['title'];
                $attributes['slug'] = $this->generateUniqueSlug($data['title'], $job->company_id, $job->id);
            }

            $job = $this->jobs->update($job, $attributes);

            if (array_key_exists('skills', $data)) {
                $this->jobs->syncSkills($job, $this->normalizeSkills($data['skills'] ?? []));
            }

            $this->logAudit($job, AuditAction::Updated, $actor, $request, $oldValues, $attributes);
            $this->logActivity($job, $job->company_id, $actor, 'job.updated', "Job \"{$job->title}\" updated.");

            return $job->fresh(['company', 'category', 'skills', 'creator', 'updater']);
        });
    }

    public function delete(Job $job, User $actor, Request $request): void
    {
        if ($job->applications()->whereNull('deleted_at')->exists()) {
            throw ValidationException::withMessages([
                'job' => ['Cannot delete a job with active applications. Close or archive it instead.'],
            ]);
        }

        DB::transaction(function () use ($job, $actor, $request): void {
            $this->logAudit($job, AuditAction::Deleted, $actor, $request);
            $this->logActivity($job, $job->company_id, $actor, 'job.deleted', "Job \"{$job->title}\" deleted.");
            $this->jobs->delete($job);
        });
    }

    public function recordView(Job $job): void
    {
        $this->jobs->incrementViews($job);
    }

    /**
     * @param  list<array<string, mixed>>|list<int>  $skills
     * @return list<array{skill_id: int, is_required: bool}>
     */
    private function normalizeSkills(array $skills): array
    {
        $normalized = [];

        foreach ($skills as $skill) {
            if (is_array($skill)) {
                $normalized[] = [
                    'skill_id' => (int) $skill['skill_id'],
                    'is_required' => (bool) ($skill['is_required'] ?? true),
                ];
            } else {
                $normalized[] = [
                    'skill_id' => (int) $skill,
                    'is_required' => true,
                ];
            }
        }

        return $normalized;
    }

    private function generateUniqueSlug(string $title, int $companyId, ?int $excludeJobId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (Job::query()
            ->where('company_id', $companyId)
            ->where('slug', $slug)
            ->when($excludeJobId, fn ($query) => $query->where('id', '!=', $excludeJobId))
            ->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    private function logAudit(
        Job $job,
        AuditAction $action,
        User $actor,
        Request $request,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        AuditLog::query()->create([
            'user_id' => $actor->id,
            'action' => $action,
            'auditable_type' => Job::class,
            'auditable_id' => $job->id,
            'old_values' => $oldValues,
            'new_values' => $newValues ? array_map(
                fn ($v) => $v instanceof \BackedEnum ? $v->value : $v,
                $newValues
            ) : null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }

    private function logActivity(Job $job, int $companyId, User $actor, string $type, string $description): void
    {
        ActivityLog::query()->create([
            'user_id' => $actor->id,
            'company_id' => $companyId,
            'activity_type' => $type,
            'description' => $description,
            'subject_type' => Job::class,
            'subject_id' => $job->id,
            'properties' => ['job_uuid' => $job->uuid, 'status' => $job->status->value],
            'created_at' => now(),
        ]);
    }
}
