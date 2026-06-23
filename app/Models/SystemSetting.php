<?php

namespace App\Models;

use Database\Factories\SystemSettingFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $key
 * @property array<string, mixed> $value
 * @property string $group
 * @property string|null $description
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $updater
 */
class SystemSetting extends Model
{
    /** @use HasFactory<SystemSettingFactory> */
    use HasFactory;

    public const GROUP_GENERAL = 'general';

    public const GROUP_EMAIL = 'email';

    public const GROUP_SECURITY = 'security';

    protected $fillable = [
        'key',
        'value',
        'group',
        'description',
        'updated_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeInGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
