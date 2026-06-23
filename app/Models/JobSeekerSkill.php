<?php

namespace App\Models;

use Database\Factories\JobSeekerSkillFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $job_seeker_profile_id
 * @property int $skill_id
 * @property int $proficiency_level
 * @property string|null $years_of_experience
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read JobSeekerProfile $jobSeekerProfile
 * @property-read Skill $skill
 */
class JobSeekerSkill extends Model
{
    /** @use HasFactory<JobSeekerSkillFactory> */
    use HasFactory;

    protected $fillable = [
        'job_seeker_profile_id',
        'skill_id',
        'proficiency_level',
        'years_of_experience',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'proficiency_level' => 'integer',
            'years_of_experience' => 'decimal:1',
        ];
    }

    /**
     * @return BelongsTo<JobSeekerProfile, $this>
     */
    public function jobSeekerProfile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }

    /**
     * @return BelongsTo<Skill, $this>
     */
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}
