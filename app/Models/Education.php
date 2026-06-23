<?php

namespace App\Models;

use Database\Factories\EducationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $job_seeker_profile_id
 * @property string $institution
 * @property string $degree
 * @property string|null $field_of_study
 * @property string|null $grade
 * @property string|null $description
 * @property Carbon|null $started_at
 * @property Carbon|null $ended_at
 * @property bool $is_current
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read JobSeekerProfile $jobSeekerProfile
 */
class Education extends Model
{
    /** @use HasFactory<EducationFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'job_seeker_profile_id',
        'institution',
        'degree',
        'field_of_study',
        'grade',
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
