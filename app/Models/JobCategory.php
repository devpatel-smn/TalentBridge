<?php

namespace App\Models;

use Database\Factories\JobCategoryFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property int|null $parent_id
 * @property int $sort_order
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read JobCategory|null $parent
 */
class JobCategory extends Model
{
    /** @use HasFactory<JobCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeRoots(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    /**
     * @return BelongsTo<JobCategory, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class, 'parent_id');
    }

    /**
     * @return HasMany<JobCategory, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(JobCategory::class, 'parent_id');
    }

    /**
     * @return HasMany<Job, $this>
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'category_id');
    }
}
