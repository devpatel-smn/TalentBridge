<?php

namespace App\Models;

use Database\Factories\SavedJobFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $job_seeker_profile_id
 * @property int $job_id
 * @property Carbon|null $created_at
 * @property-read JobSeekerProfile $jobSeekerProfile
 * @property-read Job $job
 */
class SavedJob extends Model
{
    /** @use HasFactory<SavedJobFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'job_seeker_profile_id',
        'job_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
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
     * @return BelongsTo<Job, $this>
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }
}
