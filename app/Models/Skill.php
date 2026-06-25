<?php

namespace App\Models;

use Database\Factories\SkillFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $category
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Skill extends Model
{
    /** @use HasFactory<SkillFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
    ];

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeInCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * @return HasMany<JobSeekerSkill, $this>
     */
    public function jobSeekerSkills(): HasMany
    {
        return $this->hasMany(JobSeekerSkill::class);
    }

    /**
     * @return HasMany<JobSkill, $this>
     */
    public function jobSkills(): HasMany
    {
        return $this->hasMany(JobSkill::class);
    }

    /**
     * @return BelongsToMany<JobSeekerProfile, $this>
     */
    public function jobSeekerProfiles(): BelongsToMany
    {
        return $this->belongsToMany(JobSeekerProfile::class, 'job_seeker_skills')
            ->withPivot(['proficiency_level', 'years_of_experience'])
            ->withTimestamps();
    }

    /**
     * @return BelongsToMany<Job, $this>
     */
    public function jobs(): BelongsToMany
    {
        return $this->belongsToMany(Job::class, 'job_skills')
            ->withPivot(['is_required']);
    }
}
