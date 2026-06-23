<?php

namespace App\Modules\JobSeeker\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\Education;
use App\Models\Experience;
use App\Models\JobSeekerProfile;
use App\Models\Resume;
use App\Models\ResumeSection;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\EducationRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerSkillRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\ResumeRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ResumeBuilderService
{
    public function __construct(
        private readonly ResumeRepositoryInterface $resumes,
        private readonly ExperienceRepositoryInterface $experiences,
        private readonly EducationRepositoryInterface $educations,
        private readonly JobSeekerSkillRepositoryInterface $skills,
        private readonly ProfileService $profileService,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(JobSeekerProfile $profile, array $data, User $actor, Request $request): Resume
    {
        return DB::transaction(function () use ($profile, $data, $actor, $request) {
            if (($data['is_primary'] ?? false) === true) {
                $this->resumes->clearPrimaryForProfile($profile->id);
            }

            $resume = $this->resumes->create($profile->id, [
                'title' => $data['title'],
                'source' => Resume::SOURCE_BUILDER,
                'template_key' => $data['template_key'] ?? 'classic',
                'is_primary' => $data['is_primary'] ?? false,
                'metadata' => $data['metadata'] ?? null,
            ]);

            if (! empty($data['sections'])) {
                $this->resumes->syncSections($resume, $data['sections']);
                $resume = $this->resumes->findForProfile($profile->id, $resume->uuid) ?? $resume;
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
        $this->ensureBuilderResume($resume);

        return DB::transaction(function () use ($resume, $data, $actor, $request) {
            $updates = [];

            foreach (['title', 'template_key', 'metadata'] as $field) {
                if (array_key_exists($field, $data)) {
                    $updates[$field] = $data[$field];
                }
            }

            if (($data['is_primary'] ?? false) === true) {
                $this->resumes->clearPrimaryForProfile($resume->job_seeker_profile_id, $resume->id);
                $updates['is_primary'] = true;
            } elseif (array_key_exists('is_primary', $data)) {
                $updates['is_primary'] = false;
            }

            if ($updates !== []) {
                $resume = $this->resumes->update($resume, $updates);
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

            return $resume->load('sections');
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateSections(Resume $resume, array $data, User $actor, Request $request): Resume
    {
        $this->ensureBuilderResume($resume);

        return DB::transaction(function () use ($resume, $data, $actor, $request) {
            $this->resumes->syncSections($resume, $data['sections']);

            $metadata = array_merge($resume->metadata ?? [], [
                'sections_snapshot_at' => now()->toIso8601String(),
            ]);

            $resume = $this->resumes->update($resume, ['metadata' => $metadata]);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Resume::class,
                'auditable_id' => $resume->id,
                'new_values' => ['sections' => $data['sections']],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $profile = $resume->jobSeekerProfile;
            if ($profile) {
                $this->profileService->recalculateCompletion($profile, $actor);
            }

            return $resume->load('sections');
        });
    }

    public function importFromProfile(Resume $resume, User $actor, Request $request): Resume
    {
        $this->ensureBuilderResume($resume);

        $profile = $resume->jobSeekerProfile
            ?? throw ValidationException::withMessages(['resume' => ['Profile not found.']]);

        return DB::transaction(function () use ($resume, $profile, $actor, $request) {
            $sections = [];

            if (filled($profile->summary)) {
                $sections[] = [
                    'section_type' => ResumeSection::TYPE_SUMMARY,
                    'title' => 'Summary',
                    'content' => ['text' => $profile->summary],
                    'sort_order' => 0,
                ];
            }

            $experiences = $this->experiences->listForProfile(
                $profile->id,
                new ListQueryParams(perPage: 100, order: 'desc', sort: 'sort_order')
            )->items();

            if ($experiences !== []) {
                $sections[] = [
                    'section_type' => ResumeSection::TYPE_EXPERIENCE,
                    'title' => 'Experience',
                    'content' => [
                        'items' => collect($experiences)->map(fn (Experience $exp) => [
                            'company' => $exp->company_name,
                            'title' => $exp->job_title,
                            'dates' => $this->formatDateRange($exp->started_at?->toDateString(), $exp->ended_at?->toDateString(), $exp->is_current),
                            'description' => $exp->description,
                            'is_current' => $exp->is_current,
                        ])->values()->all(),
                    ],
                    'sort_order' => 1,
                ];
            }

            $educations = $this->educations->listForProfile(
                $profile->id,
                new ListQueryParams(perPage: 100, order: 'desc', sort: 'sort_order')
            )->items();

            if ($educations !== []) {
                $sections[] = [
                    'section_type' => ResumeSection::TYPE_EDUCATION,
                    'title' => 'Education',
                    'content' => [
                        'items' => collect($educations)->map(fn (Education $edu) => [
                            'institution' => $edu->institution,
                            'degree' => $edu->degree,
                            'field' => $edu->field_of_study,
                            'dates' => $this->formatDateRange($edu->started_at?->toDateString(), $edu->ended_at?->toDateString(), $edu->is_current),
                            'grade' => $edu->grade,
                        ])->values()->all(),
                    ],
                    'sort_order' => 2,
                ];
            }

            $skillItems = $this->skills->allForProfile($profile->id);
            if ($skillItems->isNotEmpty()) {
                $sections[] = [
                    'section_type' => ResumeSection::TYPE_SKILLS,
                    'title' => 'Skills',
                    'content' => [
                        'items' => $skillItems->map(fn ($item) => [
                            'name' => $item->skill?->name,
                            'proficiency' => $item->proficiency_level,
                        ])->values()->all(),
                    ],
                    'sort_order' => 3,
                ];
            }

            $this->resumes->syncSections($resume, $sections);

            $resume = $this->resumes->update($resume, [
                'metadata' => array_merge($resume->metadata ?? [], [
                    'imported_from_profile_at' => now()->toIso8601String(),
                ]),
            ]);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Updated,
                'auditable_type' => Resume::class,
                'auditable_id' => $resume->id,
                'new_values' => ['imported_from_profile' => true],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $resume->load('sections');
        });
    }

    /**
     * @return array{resume: Resume, export_status: string, file_uuid: string|null}
     */
    public function export(Resume $resume, User $actor, Request $request): array
    {
        $this->ensureBuilderResume($resume);

        if ($resume->sections()->count() === 0) {
            throw ValidationException::withMessages([
                'resume' => ['Add at least one section before exporting.'],
            ]);
        }

        return DB::transaction(function () use ($resume, $actor, $request) {
            $resume = $this->resumes->update($resume, [
                'metadata' => array_merge($resume->metadata ?? [], [
                    'export_requested_at' => now()->toIso8601String(),
                    'export_snapshot' => $resume->sections()->ordered()->get()->toArray(),
                ]),
            ]);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Exported,
                'auditable_type' => Resume::class,
                'auditable_id' => $resume->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return [
                'resume' => $resume->load(['sections', 'file']),
                'export_status' => $resume->file_id ? 'ready' : 'snapshot_saved',
                'file_uuid' => $resume->file?->uuid,
            ];
        });
    }

    private function ensureBuilderResume(Resume $resume): void
    {
        if ($resume->source !== Resume::SOURCE_BUILDER) {
            throw ValidationException::withMessages([
                'resume' => ['This action is only available for builder resumes.'],
            ]);
        }
    }

    private function formatDateRange(?string $start, ?string $end, bool $isCurrent): string
    {
        if ($start === null && $end === null) {
            return '';
        }

        if ($isCurrent) {
            return trim(($start ?? '').' - Present', ' -');
        }

        return trim(($start ?? '').' - '.($end ?? ''), ' -');
    }
}
