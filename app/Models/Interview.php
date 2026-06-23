<?php

namespace App\Models;

use App\Enums\InterviewStatus;
use App\Enums\InterviewType;
use App\Traits\HasUuid;
use Database\Factories\InterviewFactory;
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
 * @property int $job_application_id
 * @property int $company_id
 * @property int $scheduled_by
 * @property InterviewType $interview_type
 * @property InterviewStatus $status
 * @property string|null $title
 * @property Carbon $scheduled_at
 * @property int $duration_minutes
 * @property string $timezone
 * @property string|null $location
 * @property string|null $meeting_link
 * @property string|null $instructions
 * @property string|null $feedback
 * @property int|null $rating
 * @property Carbon|null $completed_at
 * @property Carbon|null $cancelled_at
 * @property string|null $cancellation_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read JobApplication $jobApplication
 * @property-read Company $company
 * @property-read User $scheduler
 */
class Interview extends Model
{
    /** @use HasFactory<InterviewFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'job_application_id',
        'company_id',
        'scheduled_by',
        'interview_type',
        'status',
        'title',
        'scheduled_at',
        'duration_minutes',
        'timezone',
        'location',
        'meeting_link',
        'instructions',
        'feedback',
        'rating',
        'completed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'interview_type' => InterviewType::class,
            'status' => InterviewStatus::class,
            'scheduled_at' => 'datetime',
            'duration_minutes' => 'integer',
            'rating' => 'integer',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('scheduled_at', '>=', now())
            ->whereNotIn('status', [
                InterviewStatus::Cancelled,
                InterviewStatus::Completed,
            ]);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeScheduled(Builder $query): Builder
    {
        return $query->where('status', InterviewStatus::Scheduled);
    }

    /**
     * @return BelongsTo<JobApplication, $this>
     */
    public function jobApplication(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * @return BelongsTo<Company, $this>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function scheduler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'scheduled_by');
    }

    /**
     * @return HasMany<InterviewParticipant, $this>
     */
    public function participants(): HasMany
    {
        return $this->hasMany(InterviewParticipant::class);
    }

    /**
     * @return HasMany<InterviewStatusHistory, $this>
     */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(InterviewStatusHistory::class)->orderBy('created_at');
    }
}
