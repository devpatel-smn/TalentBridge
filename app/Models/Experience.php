<?php

namespace App\Models;

use App\Enums\EmploymentType;
use Database\Factories\ExperienceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $job_seeker_profile_id
 * @property string $company_name
 * @property string $job_title
 * @property EmploymentType|null $employment_type
 * @property string|null $location
 * @property string|null $description
 * @property Carbon $started_at
 * @property Carbon|null $ended_at
 * @property bool $is_current
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read JobSeekerProfile $jobSeekerProfile
 */
class Experience extends Model
{
    /** @use HasFactory<ExperienceFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'job_seeker_profile_id',
        'company_name',
        'job_title',
        'employment_type',
        'location',
        'description',
        'started_at',
        'ended_at',
        'is_current',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'employment_type' => EmploymentType::class,
            'started_at' => 'date',
            'ended_at' => 'date',
            'is_current' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeCurrent(Builder $query): Builder
    {
        return $query->where('is_current', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    /**
     * @return BelongsTo<JobSeekerProfile, $this>
     */
    public function jobSeekerProfile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }
}
