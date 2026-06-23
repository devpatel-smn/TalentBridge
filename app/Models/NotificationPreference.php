<?php

namespace App\Models;

use App\Enums\NotificationType;
use Database\Factories\NotificationPreferenceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property NotificationType $notification_type
 * @property bool $channel_mail
 * @property bool $channel_database
 * @property bool $channel_push
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 */
class NotificationPreference extends Model
{
    /** @use HasFactory<NotificationPreferenceFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'notification_type',
        'channel_mail',
        'channel_database',
        'channel_push',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'notification_type' => NotificationType::class,
            'channel_mail' => 'boolean',
            'channel_database' => 'boolean',
            'channel_push' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeForType(Builder $query, NotificationType $type): Builder
    {
        return $query->where('notification_type', $type);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
