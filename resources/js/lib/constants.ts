export const APP_NAME = 'TalentBridge';
export const THEME_STORAGE_KEY = 'talentbridge-theme';
export const COMPANY_ID_STORAGE_KEY = 'talentbridge-company-id';

export const API_BASE_URL = '/api/v1';
export const SANCTUM_CSRF_URL = '/sanctum/csrf-cookie';

export const DEFAULT_PAGE_SIZE = 15;

export const ROLES = {
    ADMIN: 'admin',
    EMPLOYER: 'employer',
    JOB_SEEKER: 'job_seeker',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.EMPLOYER]: '/employer',
    [ROLES.JOB_SEEKER]: '/job-seeker',
};
