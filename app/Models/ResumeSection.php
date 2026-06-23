<?php

namespace App\Models;

use Database\Factories\ResumeSectionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $resume_id
 * @property string $section_type
 * @property string|null $title
 * @property array<string, mixed> $content
 * @property int $sort_order
 * @property bool $is_visible
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Resume $resume
 */
class ResumeSection extends Model
{
    /** @use HasFactory<ResumeSectionFactory> */
    use HasFactory;

    public const TYPE_SUMMARY = 'summary';

    public const TYPE_EXPERIENCE = 'experience';

    public const TYPE_EDUCATION = 'education';

    public const TYPE_SKILLS = 'skills';

    public const TYPE_CUSTOM = 'custom';

    protected $fillable = [
        'resume_id',
        'section_type',
        'title',
        'content',
        'sort_order',
        'is_visible',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'content' => 'array',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    /**
     * @return BelongsTo<Resume, $this>
     */
    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
