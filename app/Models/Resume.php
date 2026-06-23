<?php

namespace App\Models;

use App\Traits\HasUuid;
use Database\Factories\ResumeFactory;
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
 * @property int $job_seeker_profile_id
 * @property string $title
 * @property string $template_key
 * @property bool $is_primary
 * @property string $source
 * @property int|null $file_id
 * @property array<string, mixed>|null $metadata
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read JobSeekerProfile $jobSeekerProfile
 * @property-read File|null $file
 */
class Resume extends Model
{
    /** @use HasFactory<ResumeFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    public const SOURCE_UPLOAD = 'upload';

    public const SOURCE_BUILDER = 'builder';

    protected $fillable = [
        'uuid',
        'job_seeker_profile_id',
        'title',
        'template_key',
        'is_primary',
        'source',
        'file_id',
        'metadata',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'metadata' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePrimary(Builder $query): Builder
    {
        return $query->where('is_primary', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFromBuilder(Builder $query): Builder
    {
        return $query->where('source', self::SOURCE_BUILDER);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeUploaded(Builder $query): Builder
    {
        return $query->where('source', self::SOURCE_UPLOAD);
    }

    /**
     * @return BelongsTo<JobSeekerProfile, $this>
     */
    public function jobSeekerProfile(): BelongsTo
    {
        return $this->belongsTo(JobSeekerProfile::class);
    }

    /**
     * @return BelongsTo<File, $this>
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    /**
     * @return HasMany<ResumeSection, $this>
     */
    public function sections(): HasMany
    {
        return $this->hasMany(ResumeSection::class);
    }

    /**
     * @return HasMany<JobApplication, $this>
     */
    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
