<?php

namespace App\Models;

use Database\Factories\JobRecommendationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $job_seeker_profile_id
 * @property int $job_id
 * @property string $score
 * @property array<string, mixed>|null $reason
 * @property bool $is_dismissed
 * @property bool $is_viewed
 * @property Carbon $generated_at
 * @property Carbon|null $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read JobSeekerProfile $jobSeekerProfile
 * @property-read Job $job
 */
class JobRecommendation extends Model
{
    /** @use HasFactory<JobRecommendationFactory> */
    use HasFactory;

    protected $fillable = [
        'job_seeker_profile_id',
        'job_id',
        'score',
        'reason',
        'is_dismissed',
        'is_viewed',
        'generated_at',
        'expires_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'score' => 'decimal:2',
            'reason' => 'array',
            'is_dismissed' => 'boolean',
            'is_viewed' => 'boolean',
            'generated_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_dismissed', false)
            ->where(function (Builder $query): void {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeNotViewed(Builder $query): Builder
    {
        return $query->where('is_viewed', false);
    }

    /**
     * @return BelongsTo<JobSeekerProfile, $this>
     */
    public function jobSeekerProfile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }

    /**
     * @return BelongsTo<Job, $this>
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }
}
