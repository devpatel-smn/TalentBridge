<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Database\Factories\ApplicationStatusHistoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $job_application_id
 * @property ApplicationStatus|null $from_status
 * @property ApplicationStatus $to_status
 * @property int $changed_by
 * @property string|null $notes
 * @property Carbon $created_at
 * @property-read JobApplication $jobApplication
 * @property-read User $changedByUser
 */
class ApplicationStatusHistory extends Model
{
    /** @use HasFactory<ApplicationStatusHistoryFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'job_application_id',
        'from_status',
        'to_status',
        'changed_by',
        'notes',
        'created_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'from_status' => ApplicationStatus::class,
            'to_status' => ApplicationStatus::class,
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<JobApplication, $this>
     */
    public function jobApplication(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function changedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
