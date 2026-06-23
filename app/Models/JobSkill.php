<?php

namespace App\Models;

use Database\Factories\JobSkillFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $job_id
 * @property int $skill_id
 * @property bool $is_required
 * @property Carbon|null $created_at
 * @property-read Job $job
 * @property-read Skill $skill
 */
class JobSkill extends Model
{
    /** @use HasFactory<JobSkillFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'job_id',
        'skill_id',
        'is_required',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Job, $this>
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * @return BelongsTo<Skill, $this>
     */
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}
