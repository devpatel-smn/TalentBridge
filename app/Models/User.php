<?php

namespace App\Models;

use App\Enums\UserStatus;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyEmailNotification;
use App\Traits\HasUuid;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $uuid
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $phone
 * @property int|null $avatar_file_id
 * @property UserStatus $status
 * @property Carbon|null $last_login_at
 * @property string|null $last_login_ip
 * @property string $timezone
 * @property string $locale
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read string $full_name
 * @property-read File|null $avatar
 * @property-read JobSeekerProfile|null $jobSeekerProfile
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, HasUuid, Notifiable, SoftDeletes;

    protected $fillable = [
        'uuid',
        'first_name',
        'last_name',
        'email',
        'email_verified_at',
        'password',
        'phone',
        'avatar_file_id',
        'status',
        'last_login_at',
        'last_login_ip',
        'timezone',
        'locale',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class,
            'last_login_at' => 'datetime',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', UserStatus::Active);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeStatus(Builder $query, UserStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * @return BelongsTo<File, $this>
     */
    public function avatar(): BelongsTo
    {
        return $this->belongsTo(File::class, 'avatar_file_id');
    }

    /**
     * @return HasOne<JobSeekerProfile, $this>
     */
    public function jobSeekerProfile(): HasOne
    {
        return $this->hasOne(JobSeekerProfile::class);
    }

    /**
     * @return HasMany<EmployerUser, $this>
     */
    public function employerUsers(): HasMany
    {
        return $this->hasMany(EmployerUser::class);
    }

    /**
     * @return BelongsToMany<Company, $this>
     */
    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'employer_users')
            ->withPivot(['job_title', 'is_primary', 'is_active', 'invited_by', 'joined_at'])
            ->withTimestamps()
            ->wherePivotNull('deleted_at');
    }

    /**
     * @return HasMany<File, $this>
     */
    public function uploadedFiles(): HasMany
    {
        return $this->hasMany(File::class, 'uploaded_by');
    }

    /**
     * @return HasMany<NotificationPreference, $this>
     */
    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(NotificationPreference::class);
    }

    /**
     * @return MorphMany<DatabaseNotification, $this>
     */
    public function notifications(): MorphMany
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->latest();
    }

    /**
     * @return HasMany<AuditLog, $this>
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * @return HasMany<ActivityLog, $this>
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * @return HasMany<Company, $this>
     */
    public function createdCompanies(): HasMany
    {
        return $this->hasMany(Company::class, 'created_by');
    }

    /**
     * @return HasMany<Job, $this>
     */
    public function createdJobs(): HasMany
    {
        return $this->hasMany(Job::class, 'created_by');
    }

    /**
     * @return HasMany<Interview, $this>
     */
    public function scheduledInterviews(): HasMany
    {
        return $this->hasMany(Interview::class, 'scheduled_by');
    }

    /**
     * @return HasMany<InterviewParticipant, $this>
     */
    public function interviewParticipations(): HasMany
    {
        return $this->hasMany(InterviewParticipant::class);
    }

    /**
     * @return HasMany<ApplicationStatusHistory, $this>
     */
    public function applicationStatusChanges(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class, 'changed_by');
    }

    /**
     * @return HasMany<CompanyVerification, $this>
     */
    public function submittedVerifications(): HasMany
    {
        return $this->hasMany(CompanyVerification::class, 'submitted_by');
    }

    /**
     * @return HasMany<CompanyVerification, $this>
     */
    public function reviewedVerifications(): HasMany
    {
        return $this->hasMany(CompanyVerification::class, 'reviewer_id');
    }

    /**
     * @return HasMany<SystemSetting, $this>
     */
    public function updatedSettings(): HasMany
    {
        return $this->hasMany(SystemSetting::class, 'updated_by');
    }

    public function hasRoleName(string $role): bool
    {
        return $this->hasRole($role);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(Role::ADMIN);
    }

    public function isEmployer(): bool
    {
        return $this->hasRole(Role::EMPLOYER);
    }

    public function isJobSeeker(): bool
    {
        return $this->hasRole(Role::JOB_SEEKER);
    }

    public function isActiveAccount(): bool
    {
        return $this->status === UserStatus::Active;
    }

    public function belongsToCompany(int $companyId): bool
    {
        return $this->employerUsers()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->exists();
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmailNotification);
    }

    public function sendPasswordResetNotification(#[\SensitiveParameter] $token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
