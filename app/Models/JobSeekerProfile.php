<?php

namespace App\Models;

use App\Enums\EmploymentType;
use App\Enums\WorkMode;
use App\Traits\HasUuid;
use Database\Factories\JobSeekerProfileFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int $user_id
 * @property string|null $headline
 * @property string|null $summary
 * @property string|null $current_title
 * @property string|null $years_of_experience
 * @property string|null $expected_salary_min
 * @property string|null $expected_salary_max
 * @property string $salary_currency
 * @property WorkMode|null $preferred_work_mode
 * @property EmploymentType|null $preferred_employment_type
 * @property bool $willing_to_relocate
 * @property string|null $location_city
 * @property string|null $location_state
 * @property string|null $location_country
 * @property string|null $linkedin_url
 * @property string|null $portfolio_url
 * @property int $profile_completion
 * @property bool $is_open_to_work
 * @property bool $is_profile_public
 * @property int|null $resume_file_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User $user
 * @property-read File|null $resumeFile
 */
class JobSeekerProfile extends Model
{
    /** @use HasFactory<JobSeekerProfileFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'headline',
        'summary',
        'current_title',
        'years_of_experience',
        'expected_salary_min',
        'expected_salary_max',
        'salary_currency',
        'preferred_work_mode',
        'preferred_employment_type',
        'willing_to_relocate',
        'location_city',
        'location_state',
        'location_country',
        'linkedin_url',
        'portfolio_url',
        'profile_completion',
        'is_open_to_work',
        'is_profile_public',
        'resume_file_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'years_of_experience' => 'decimal:1',
            'expected_salary_min' => 'decimal:2',
            'expected_salary_max' => 'decimal:2',
            'preferred_work_mode' => WorkMode::class,
            'preferred_employment_type' => EmploymentType::class,
            'willing_to_relocate' => 'boolean',
            'profile_completion' => 'integer',
            'is_open_to_work' => 'boolean',
            'is_profile_public' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOpenToWork(Builder $query): Builder
    {
        return $query->where('is_open_to_work', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_profile_public', true);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<File, $this>
     */
    public function resumeFile(): BelongsTo
    {
        return $this->belongsTo(File::class, 'resume_file_id');
    }

    /**
     * @return HasMany<Experience, $this>
     */
    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    /**
     * @return HasMany<Education, $this>
     */
    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    /**
     * @return HasMany<JobSeekerSkill, $this>
     */
    public function jobSeekerSkills(): HasMany
    {
        return $this->hasMany(JobSeekerSkill::class);
    }

    /**
     * @return BelongsToMany<Skill, $this>
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_seeker_skills')
            ->withPivot(['proficiency_level', 'years_of_experience'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<Resume, $this>
     */
    public function resumes(): HasMany
    {
        return $this->hasMany(Resume::class);
    }

    /**
     * @return HasMany<JobApplication, $this>
     */
    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * @return HasMany<SavedJob, $this>
     */
    public function savedJobs(): HasMany
    {
        return $this->hasMany(SavedJob::class);
    }

    /**
     * @return BelongsToMany<Job, $this>
     */
    public function savedJobListings(): BelongsToMany
    {
        return $this->belongsToMany(Job::class, 'saved_jobs')
            ->withTimestamps(false);
    }

    /**
     * @return HasMany<JobRecommendation, $this>
     */
    public function recommendations(): HasMany
    {
        return $this->hasMany(JobRecommendation::class);
    }
}
