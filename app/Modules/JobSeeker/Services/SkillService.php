<?php

namespace App\Modules\JobSeeker\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\JobSeekerProfile;
use App\Models\JobSeekerSkill;
use App\Models\Skill;
use App\Models\User;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerSkillRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SkillService
{
    public function __construct(
        private readonly JobSeekerSkillRepositoryInterface $skills,
        private readonly ProfileService $profileService,
    ) {}

    public function list(int $profileId, ListQueryParams $params): LengthAwarePaginator
    {
        return $this->skills->listForProfile($profileId, $params);
    }

    public function find(int $profileId, int $jobSeekerSkillId): JobSeekerSkill
    {
        return $this->skills->findForProfile($profileId, $jobSeekerSkillId)
            ?? throw ValidationException::withMessages(['skill' => ['Skill not found.']]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function add(JobSeekerProfile $profile, array $data, User $actor, Request $request): JobSeekerSkill
    {
        return DB::transaction(function () use ($profile, $data, $actor, $request) {
            $skillId = $this->resolveSkillId($data);

            if ($this->skills->existsForProfile($profile->id, $skillId)) {
                throw ValidationException::withMessages([
                    'skill_id' => ['This skill is already on your profile.'],
                ]);
            }

            $jobSeekerSkill = $this->skills->create($profile->id, [
                'skill_id' => $skillId,
                'proficiency_level' => $data['proficiency_level'],
                'years_of_experience' => $data['years_of_experience'] ?? null,
            ]);

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Created,
                'auditable_type' => JobSeekerSkill::class,
                'auditable_id' => $jobSeekerSkill->id,
                'new_values' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->profileService->recalculateCompletion($profile, $actor);

            return $jobSeekerSkill;
        });
    }

    public function remove(JobSeekerSkill $jobSeekerSkill, User $actor, Request $request): void
    {
        DB::transaction(function () use ($jobSeekerSkill, $actor, $request) {
            $profile = $jobSeekerSkill->jobSeekerProfile;

            AuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => AuditAction::Deleted,
                'auditable_type' => JobSeekerSkill::class,
                'auditable_id' => $jobSeekerSkill->id,
                'old_values' => $jobSeekerSkill->toArray(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            $this->skills->delete($jobSeekerSkill);

            if ($profile) {
                $this->profileService->recalculateCompletion($profile, $actor);
            }
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveSkillId(array $data): int
    {
        if (! empty($data['skill_id'])) {
            return (int) $data['skill_id'];
        }

        if (empty($data['skill_name'])) {
            throw ValidationException::withMessages([
                'skill_id' => ['A skill_id or skill_name is required.'],
            ]);
        }

        $name = trim((string) $data['skill_name']);
        $slug = Str::slug($name);

        $skill = Skill::query()->firstOrCreate(
            ['slug' => $slug],
            ['name' => $name]
        );

        return $skill->id;
    }
}
