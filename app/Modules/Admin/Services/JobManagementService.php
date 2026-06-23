<?php

namespace App\Modules\Admin\Services;

use App\Enums\AuditAction;
use App\Enums\JobStatus;
use App\Models\AuditLog;
use App\Models\Job;
use App\Models\User;
use App\Modules\Admin\Repositories\Contracts\AdminJobRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JobManagementService
{
    public function __construct(
        private readonly AdminJobRepositoryInterface $jobs,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->jobs->paginate($params);
    }

    public function find(string $uuid): Job
    {
        return $this->jobs->findByUuid($uuid)
            ?? throw ValidationException::withMessages(['uuid' => ['Job not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Job $job, array $data, User $actor, Request $request): Job
    {
        return DB::transaction(function () use ($job, $data, $actor, $request) {
            $oldValues = $job->only(['title', 'status', 'description', 'requirements', 'vacancies']);

            $attributes = array_filter([
                'title' => $data['title'] ?? null,
                'description' => $data['description'] ?? null,
                'requirements' => $data['requirements'] ?? null,
                'responsibilities' => $data['responsibilities'] ?? null,
                'benefits' => $data['benefits'] ?? null,
                'vacancies' => $data['vacancies'] ?? null,
                'status' => isset($data['status']) ? JobStatus::from($data['status']) : null,
                'updated_by' => $actor->id,
            ], fn ($value) => $value !== null);

            if (isset($attributes['status'])) {
                $status = $attributes['status'];
                if ($status === JobStatus::Published && ! $job->published_at) {
                    $attributes['published_at'] = now();
                }
                if ($status === JobStatus::Closed && ! $job->closed_at) {
                    $attributes['closed_at'] = now();
                }
            }

            $job = $this->jobs->update($job, $attributes);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Job::class,
                'auditable_id' => $job->id,
                'old_values' => $oldValues,
                'new_values' => array_map(
                    fn ($v) => $v instanceof JobStatus ? $v->value : $v,
                    $attributes
                ),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $job;
        });
    }

    public function delete(Job $job, User $actor, Request $request): void
    {
        if ($job->applications()->whereNull('deleted_at')->exists()) {
            throw ValidationException::withMessages([
                'job' => ['Cannot delete a job with active applications. Archive or close it instead.'],
            ]);
        }

        DB::transaction(function () use ($job, $actor, $request): void {
            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => Job::class,
                'auditable_id' => $job->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->jobs->delete($job);
        });
    }
}
