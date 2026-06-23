<?php

namespace App\Models;

use Database\Factories\ActivityLogFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int|null $company_id
 * @property string $activity_type
 * @property string $description
 * @property string|null $subject_type
 * @property int|null $subject_id
 * @property array<string, mixed>|null $properties
 * @property Carbon $created_at
 * @property-read User|null $user
 * @property-read Company|null $company
 * @property-read Model|null $subject
 */
class ActivityLog extends Model
{
    /** @use HasFactory<ActivityLogFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'company_id',
        'activity_type',
        'description',
        'subject_type',
        'subject_id',
        'properties',
        'created_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'properties' => 'array',
            'created_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOfType(Builder $query, string $activityType): Builder
    {
        return $query->where('activity_type', $activityType);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeForCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Company, $this>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
