<?php

namespace App\Models;

use Database\Factories\InterviewParticipantFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $interview_id
 * @property int $user_id
 * @property string $role
 * @property string $response_status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Interview $interview
 * @property-read User $user
 */
class InterviewParticipant extends Model
{
    /** @use HasFactory<InterviewParticipantFactory> */
    use HasFactory;

    public const ROLE_INTERVIEWER = 'interviewer';

    public const ROLE_CANDIDATE = 'candidate';

    public const ROLE_OBSERVER = 'observer';

    public const RESPONSE_PENDING = 'pending';

    public const RESPONSE_ACCEPTED = 'accepted';

    public const RESPONSE_DECLINED = 'declined';

    protected $fillable = [
        'interview_id',
        'user_id',
        'role',
        'response_status',
    ];

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeInterviewers(Builder $query): Builder
    {
        return $query->where('role', self::ROLE_INTERVIEWER);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeCandidates(Builder $query): Builder
    {
        return $query->where('role', self::ROLE_CANDIDATE);
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
