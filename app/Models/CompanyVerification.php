<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use Database\Factories\CompanyVerificationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $company_id
 * @property int $submitted_by
 * @property VerificationStatus $status
 * @property string|null $business_registration_number
 * @property string|null $tax_id
 * @property array<int, int>|null $documents
 * @property string|null $notes
 * @property int|null $reviewer_id
 * @property string|null $reviewer_notes
 * @property string|null $rejection_reason
 * @property Carbon|null $reviewed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Company $company
 * @property-read User $submitter
 * @property-read User|null $reviewer
 */
class CompanyVerification extends Model
{
    /** @use HasFactory<CompanyVerificationFactory> */
    use HasFactory;

    protected $fillable = [
        'company_id',
        'submitted_by',
        'status',
        'business_registration_number',
        'tax_id',
        'documents',
        'notes',
        'reviewer_id',
        'reviewer_notes',
        'rejection_reason',
        'reviewed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => VerificationStatus::class,
            'documents' => 'array',
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', VerificationStatus::Pending);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeUnderReview(Builder $query): Builder
    {
        return $query->where('status', VerificationStatus::UnderReview);
    }

    /**
     * @return BelongsTo<Company, $this>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
