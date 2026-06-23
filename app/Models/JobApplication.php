<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Traits\HasUuid;
use Database\Factories\JobApplicationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int $job_id
 * @property int $job_seeker_profile_id
 * @property int|null $resume_id
 * @property string|null $cover_letter
 * @property ApplicationStatus $status
 * @property string|null $employer_notes
 * @property string|null $rejection_reason
 * @property Carbon $applied_at
 * @property Carbon|null $status_changed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Job $job
 * @property-read JobSeekerProfile $jobSeekerProfile
 * @property-read Resume|null $resume
 */
class JobApplication extends Model
{
    /** @use HasFactory<JobApplicationFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'job_id',
        'job_seeker_profile_id',
        'resume_id',
        'cover_letter',
        'status',
        'employer_notes',
        'rejection_reason',
        'applied_at',
        'status_changed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
            'applied_at' => 'datetime',
            'status_changed_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeStatus(Builder $query, ApplicationStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNotIn('status', [
            ApplicationStatus::Rejected,
            ApplicationStatus::Withdrawn,
            ApplicationStatus::Hired,
        ]);
    }

    /**
     * @return BelongsTo<Job, $this>
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * @return BelongsTo<JobSeekerProfile, $this>
     */
    public function jobSeekerProfile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }

    /**
     * @return BelongsTo<Resume, $this>
     */
    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }

    /**
     * @return HasMany<ApplicationStatusHistory, $this>
     */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class)->orderBy('created_at');
    }

    /**
     * @return HasMany<Interview, $this>
     */
    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }
}
