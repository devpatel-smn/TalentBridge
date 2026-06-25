<?php

namespace App\Models;

use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\WorkMode;
use App\Traits\HasAuditFields;
use App\Traits\HasUuid;
use Database\Factories\JobFactory;
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
 * @property int $company_id
 * @property int|null $category_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string|null $requirements
 * @property string|null $responsibilities
 * @property string|null $benefits
 * @property EmploymentType $employment_type
 * @property WorkMode $work_mode
 * @property string|null $experience_level
 * @property string|null $salary_min
 * @property string|null $salary_max
 * @property string $salary_currency
 * @property string $salary_period
 * @property bool $is_salary_visible
 * @property string|null $location_city
 * @property string|null $location_state
 * @property string|null $location_country
 * @property Carbon|null $application_deadline
 * @property int $vacancies
 * @property JobStatus $status
 * @property bool $is_featured
 * @property Carbon|null $published_at
 * @property Carbon|null $closed_at
 * @property int $views_count
 * @property int $applications_count
 * @property int $created_by
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Company $company
 * @property-read JobCategory|null $category
 * @property-read User $creator
 * @property-read User|null $updater
 */
class Job extends Model
{
    /** @use HasFactory<JobFactory> */
    use HasAuditFields, HasFactory, HasUuid, SoftDeletes;

    protected $table = 'jobs';

    protected $fillable = [
        'uuid',
        'company_id',
        'category_id',
        'title',
        'slug',
        'description',
        'requirements',
        'responsibilities',
        'benefits',
        'employment_type',
        'work_mode',
        'experience_level',
        'salary_min',
        'salary_max',
        'salary_currency',
        'salary_period',
        'is_salary_visible',
        'location_city',
        'location_state',
        'location_country',
        'application_deadline',
        'vacancies',
        'status',
        'is_featured',
        'published_at',
        'closed_at',
        'views_count',
        'applications_count',
        'created_by',
        'updated_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'employment_type' => EmploymentType::class,
            'work_mode' => WorkMode::class,
            'status' => JobStatus::class,
            'is_featured' => 'boolean',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'is_salary_visible' => 'boolean',
            'application_deadline' => 'date',
            'vacancies' => 'integer',
            'published_at' => 'datetime',
            'closed_at' => 'datetime',
            'views_count' => 'integer',
            'applications_count' => 'integer',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', JobStatus::Published);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', JobStatus::Draft);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', JobStatus::Published)
            ->where(function (Builder $query): void {
                $query->whereNull('application_deadline')
                    ->orWhere('application_deadline', '>=', now()->toDateString());
            });
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * @return BelongsTo<Company, $this>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return BelongsTo<JobCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * @return HasMany<JobSkill, $this>
     */
    public function jobSkills(): HasMany
    {
        return $this->hasMany(JobSkill::class);
    }

    /**
     * @return BelongsToMany<Skill, $this>
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_skills')
            ->withPivot(['is_required']);
    }

    /**
     * @return HasMany<JobApplication, $this>
     */
    public function applications(): HasMany
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
     * @return BelongsToMany<JobSeekerProfile, $this>
     */
    public function savedByProfiles(): BelongsToMany
    {
        return $this->belongsToMany(JobSeekerProfile::class, 'saved_jobs')
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
