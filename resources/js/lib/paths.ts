/** Job seeker workspace routes (primary). Legacy `/job-seeker/*` redirects here. */
export const JOB_SEEKER_PATHS = {
    dashboard: '/dashboard',
    jobs: '/dashboard/jobs',
    job: (uuid: string) => `/dashboard/jobs/${uuid}`,
    applications: '/dashboard/applications',
    savedJobs: '/dashboard/saved-jobs',
    interviews: '/dashboard/interviews',
    profile: '/dashboard/profile',
    resume: '/dashboard/resume',
    resumeBuilder: (uuid: string) => `/dashboard/resume/${uuid}/builder`,
    recommendations: '/dashboard/recommendations',
    notifications: '/notifications',
    settings: '/settings/account',
} as const;

export const PUBLIC_PATHS = {
    home: '/',
    jobs: '/jobs',
    job: (uuid: string) => `/jobs/${uuid}`,
    companies: '/companies',
    company: (slug: string) => `/companies/${slug}`,
    about: '/about',
    contact: '/contact',
    faq: '/faq',
    privacy: '/privacy',
    terms: '/terms',
    login: '/login',
    register: '/register',
} as const;

export const ADMIN_PATHS = {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
} as const;

export function isJobSeekerPath(pathname: string): boolean {
    return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
}
