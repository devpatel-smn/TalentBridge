<?php

namespace App\Modules\JobSeeker\Services;

use App\Enums\AuditAction;
use App\Enums\FileType;
use App\Models\AuditLog;
use App\Models\File;
use App\Models\JobSeekerProfile;
use App\Models\Resume;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerProfileRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\ResumeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ResumeUploadService
{
    public function __construct(
        private readonly ResumeRepositoryInterface $resumes,
        private readonly JobSeekerProfileRepositoryInterface $profiles,
        private readonly ProfileService $profileService,
    ) {}

    public function list(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->resumes->listForProfile($profileId, $params);
    }

    public function find(int $profileId, string $uuid): Resume
    {
        return $this->resumes->findForProfile($profileId, $uuid)
            ?? throw ValidationException::withMessages(['resume' => ['Resume not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function upload(JobSeekerProfile $profile, array $data, User $actor, Request $request): Resume
    {
        return DB::transaction(function () use ($profile, $data, $actor, $request) {
            $file = File::query()->find($data['file_id']);

            if (! $file || $file->uploaded_by !== $actor->id) {
                throw ValidationException::withMessages([
                    'file_id' => ['Invalid resume file.'],
                ]);
            }

            if ($file->file_type !== FileType::Resume) {
                throw ValidationException::withMessages([
                    'file_id' => ['File must be a resume.'],
                ]);
            }

            if (($data['is_primary'] ?? false) === true) {
                $this->resumes->clearPrimaryForProfile($profile->id);
            }

            $resume = $this->resumes->create($profile->id, [
                'title' => $data['title'],
                'source' => Resume::SOURCE_UPLOAD,
                'file_id' => $file->id,
                'is_primary' => $data['is_primary'] ?? false,
            ]);

            if ($resume->is_primary) {
                $this->profiles->update($profile, ['resume_file_id' => $file->id]);
            }

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Created,
                'auditable_type' => Resume::class,
                'auditable_id' => $resume->id,
                'new_values' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->profileService->recalculateCompletion($profile, $actor);

            return $resume;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Resume $resume, array $data, User $actor, Request $request): Resume
    {
        if ($resume->source !== Resume::SOURCE_UPLOAD) {
            throw ValidationException::withMessages([
                'resume' => ['Only uploaded resumes can be updated through this endpoint.'],
            ]);
        }

        return DB::transaction(function () use ($resume, $data, $actor, $request) {
            $updates = [];

            if (array_key_exists('title', $data)) {
                $updates['title'] = $data['title'];
            }

            if (array_key_exists('file_id', $data)) {
                $file = File::query()->find($data['file_id']);

                if (! $file || $file->uploaded_by !== $actor->id || $file->file_type !== FileType::Resume) {
                    throw ValidationException::withMessages([
                        'file_id' => ['Invalid resume file.'],
                    ]);
                }

                $updates['file_id'] = $file->id;
            }

            if (($data['is_primary'] ?? false) === true) {
                $this->resumes->clearPrimaryForProfile($resume->job_seeker_profile_id, $resume->id);
                $updates['is_primary'] = true;
            } elseif (array_key_exists('is_primary', $data)) {
                $updates['is_primary'] = false;
            }

            $resume = $this->resumes->update($resume, $updates);

            if ($resume->is_primary && $resume->file_id) {
                $profile = $resume->jobSeekerProfile;
                if ($profile) {
                    $this->profiles->update($profile, ['resume_file_id' => $resume->file_id]);
                }
            }

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Resume::class,
                'auditable_id' => $resume->id,
                'new_values' => $updates,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $resume;
        });
    }

    public function delete(Resume $resume, User $actor, Request $request): void
    {
        DB::transaction(function () use ($resume, $actor, $request) {
            $profile = $resume->jobSeekerProfile;

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => Resume::class,
                'auditable_id' => $resume->id,
                'old_values' => $resume->toArray(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->resumes->delete($resume);

            if ($profile) {
                $this->profileService->recalculateCompletion($profile, $actor);
            }
        });
    }
}
