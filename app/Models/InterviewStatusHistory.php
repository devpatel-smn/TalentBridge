<?php

namespace App\Models;

use App\Enums\InterviewStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $interview_id
 * @property InterviewStatus|null $from_status
 * @property InterviewStatus $to_status
 * @property int $changed_by
 * @property string|null $notes
 * @property Carbon $created_at
 * @property-read Interview $interview
 * @property-read User $changedByUser
 */
class InterviewStatusHistory extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'interview_id',
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
            'from_status' => InterviewStatus::class,
            'to_status' => InterviewStatus::class,
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Interview, $this>
     */
    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function changedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
