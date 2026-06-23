<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use App\Traits\HasAuditFields;
use App\Traits\HasUuid;
use Database\Factories\CompanyFactory;
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
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $website
 * @property string|null $industry
 * @property string|null $company_size
 * @property int|null $founded_year
 * @property string|null $headquarters
 * @property int|null $logo_file_id
 * @property VerificationStatus $verification_status
 * @property Carbon|null $verified_at
 * @property int|null $verified_by
 * @property array<string, mixed>|null $social_links
 * @property array<string, mixed>|null $settings
 * @property int $created_by
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read File|null $logo
 * @property-read User|null $verifier
 * @property-read User $creator
 * @property-read User|null $updater
 */
class Company extends Model
{
    /** @use HasFactory<CompanyFactory> */
    use HasAuditFields, HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'description',
        'website',
        'industry',
        'company_size',
        'founded_year',
        'headquarters',
        'logo_file_id',
        'verification_status',
        'verified_at',
        'verified_by',
        'social_links',
        'settings',
        'created_by',
        'updated_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'verification_status' => VerificationStatus::class,
            'verified_at' => 'datetime',
            'founded_year' => 'integer',
            'social_links' => 'array',
            'settings' => 'array',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('verification_status', VerificationStatus::Approved);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePendingVerification(Builder $query): Builder
    {
        return $query->whereIn('verification_status', [
            VerificationStatus::Pending,
            VerificationStatus::UnderReview,
            VerificationStatus::ResubmissionRequired,
        ]);
    }

    /**
     * @return BelongsTo<File, $this>
     */
    public function logo(): BelongsTo
    {
        return $this->belongsTo(File::class, 'logo_file_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * @return HasMany<EmployerUser, $this>
     */
    public function employerUsers(): HasMany
    {
        return $this->hasMany(EmployerUser::class);
    }

    /**
     * @return HasMany<CompanyVerification, $this>
     */
    public function verifications(): HasMany
    {
        return $this->hasMany(CompanyVerification::class);
    }

    /**
     * @return HasMany<Job, $this>
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class);
    }

    /**
     * @return HasMany<Interview, $this>
     */
    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    /**
     * @return HasMany<ActivityLog, $this>
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}
