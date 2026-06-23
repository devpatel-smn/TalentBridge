<?php

namespace App\Support;

final class Permissions
{
    public const USERS_VIEW = 'users.view';

    public const USERS_CREATE = 'users.create';

    public const USERS_UPDATE = 'users.update';

    public const USERS_DELETE = 'users.delete';

    public const USERS_SUSPEND = 'users.suspend';

    public const COMPANIES_VIEW = 'companies.view';

    public const COMPANIES_UPDATE = 'companies.update';

    public const COMPANIES_VERIFY = 'companies.verify';

    public const JOBS_VIEW = 'jobs.view';

    public const JOBS_CREATE = 'jobs.create';

    public const JOBS_UPDATE = 'jobs.update';

    public const JOBS_DELETE = 'jobs.delete';

    public const JOBS_PUBLISH = 'jobs.publish';

    public const APPLICATIONS_VIEW = 'applications.view';

    public const APPLICATIONS_MANAGE = 'applications.manage';

    public const INTERVIEWS_VIEW = 'interviews.view';

    public const INTERVIEWS_MANAGE = 'interviews.manage';

    public const PROFILES_VIEW = 'profiles.view';

    public const PROFILES_MANAGE = 'profiles.manage';

    public const RESUMES_MANAGE = 'resumes.manage';

    public const ANALYTICS_VIEW = 'analytics.view';

    public const ANALYTICS_ADMIN = 'analytics.admin';

    public const SETTINGS_MANAGE = 'settings.manage';

    public const AUDIT_VIEW = 'audit.view';

    public const VERIFICATIONS_REVIEW = 'verifications.review';

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        return [
            self::USERS_VIEW,
            self::USERS_CREATE,
            self::USERS_UPDATE,
            self::USERS_DELETE,
            self::USERS_SUSPEND,
            self::COMPANIES_VIEW,
            self::COMPANIES_UPDATE,
            self::COMPANIES_VERIFY,
            self::JOBS_VIEW,
            self::JOBS_CREATE,
            self::JOBS_UPDATE,
            self::JOBS_DELETE,
            self::JOBS_PUBLISH,
            self::APPLICATIONS_VIEW,
            self::APPLICATIONS_MANAGE,
            self::INTERVIEWS_VIEW,
            self::INTERVIEWS_MANAGE,
            self::PROFILES_VIEW,
            self::PROFILES_MANAGE,
            self::RESUMES_MANAGE,
            self::ANALYTICS_VIEW,
            self::ANALYTICS_ADMIN,
            self::SETTINGS_MANAGE,
            self::AUDIT_VIEW,
            self::VERIFICATIONS_REVIEW,
        ];
    }
}
