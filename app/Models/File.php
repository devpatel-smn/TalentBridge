<?php

namespace App\Models;

use App\Enums\FileType;
use App\Traits\HasUuid;
use Database\Factories\FileFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int|null $uploaded_by
 * @property string $disk
 * @property string $path
 * @property string $original_name
 * @property string $mime_type
 * @property int $size_bytes
 * @property FileType $file_type
 * @property string|null $entity_type
 * @property int|null $entity_id
 * @property string|null $checksum
 * @property array<string, mixed>|null $metadata
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User|null $uploader
 * @property-read Model|null $entity
 */
class File extends Model
{
    /** @use HasFactory<FileFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'uploaded_by',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size_bytes',
        'file_type',
        'entity_type',
        'entity_id',
        'checksum',
        'metadata',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'file_type' => FileType::class,
            'size_bytes' => 'integer',
            'metadata' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOfType(Builder $query, FileType $type): Builder
    {
        return $query->where('file_type', $type);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function entity(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return HasOne<User, $this>
     */
    public function avatarUser(): HasOne
    {
        return $this->hasOne(User::class, 'avatar_file_id');
    }

    /**
     * @return HasOne<Company, $this>
     */
    public function logoCompany(): HasOne
    {
        return $this->hasOne(Company::class, 'logo_file_id');
    }

    /**
     * @return HasOne<Resume, $this>
     */
    public function resume(): HasOne
    {
        return $this->hasOne(Resume::class, 'file_id');
    }

    /**
     * @return HasOne<JobSeekerProfile, $this>
     */
    public function primaryResumeProfile(): HasOne
    {
        return $this->hasOne(JobSeekerProfile::class, 'resume_file_id');
    }
}
