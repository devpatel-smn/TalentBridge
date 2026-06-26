import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import { JobSeekerLayout } from '@/components/layout/JobSeekerLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { GuestRoute } from '@/routes/GuestRoute';
import { AdminGuestRoute } from '@/routes/AdminGuestRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { ROLES } from '@/lib/constants';
import { JOB_SEEKER_PATHS } from '@/lib/paths';
import { LegacyJobDetailRedirect, LegacyResumeBuilderRedirect } from '@/routes/LegacyRedirects';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() =>
    import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
    import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
const AcceptTeamInvitePage = lazy(() =>
    import('@/features/auth/pages/AcceptTeamInvitePage').then((m) => ({ default: m.AcceptTeamInvitePage })),
);
const VerifyEmailPage = lazy(() =>
    import('@/features/auth/pages/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
);
const AdminLoginPage = lazy(() =>
    import('@/features/auth/pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);

const HomePage = lazy(() => import('@/features/public/pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/features/public/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/features/public/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('@/features/public/pages/FAQPage').then((m) => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import('@/features/public/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('@/features/public/pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const CompaniesPage = lazy(() =>
    import('@/features/public/pages/CompaniesPage').then((m) => ({ default: m.CompaniesPage })),
);
const CompanyDetailPage = lazy(() =>
    import('@/features/public/pages/CompanyDetailPage').then((m) => ({ default: m.CompanyDetailPage })),
);
const JobListPage = lazy(() => import('@/features/jobs/pages/JobListPage').then((m) => ({ default: m.JobListPage })));
const JobDetailPage = lazy(() => import('@/features/jobs/pages/JobDetailPage').then((m) => ({ default: m.JobDetailPage })));

const AdminDashboardPage = lazy(() =>
    import('@/features/admin/pages/DashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminAdminsPage = lazy(() => import('@/features/admin/pages/AdminsPage').then((m) => ({ default: m.AdminAdminsPage })));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/UsersPage').then((m) => ({ default: m.AdminUsersPage })));
const AdminUserDetailPage = lazy(() =>
    import('@/features/admin/pages/UserDetailPage').then((m) => ({ default: m.AdminUserDetailPage })),
);
const AdminCompaniesPage = lazy(() =>
    import('@/features/admin/pages/CompaniesPage').then((m) => ({ default: m.AdminCompaniesPage })),
);
const AdminCompanyDetailPage = lazy(() =>
    import('@/features/admin/pages/CompanyDetailPage').then((m) => ({ default: m.AdminCompanyDetailPage })),
);
const AdminJobsPage = lazy(() => import('@/features/admin/pages/JobsPage').then((m) => ({ default: m.AdminJobsPage })));
const AdminVerificationsPage = lazy(() =>
    import('@/features/admin/pages/VerificationsPage').then((m) => ({ default: m.AdminVerificationsPage })),
);
const AdminInterviewsPage = lazy(() =>
    import('@/features/admin/pages/InterviewsPage').then((m) => ({ default: m.AdminInterviewsPage })),
);
const AdminAnalyticsPage = lazy(() =>
    import('@/features/admin/pages/AnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage })),
);
const AdminActivityLogsPage = lazy(() =>
    import('@/features/admin/pages/ActivityLogsPage').then((m) => ({ default: m.AdminActivityLogsPage })),
);
const AdminSettingsPage = lazy(() =>
    import('@/features/admin/pages/SettingsPage').then((m) => ({ default: m.AdminSettingsPage })),
);

const EmployerDashboardPage = lazy(() =>
    import('@/features/employer/pages/DashboardPage').then((m) => ({ default: m.EmployerDashboardPage })),
);
const CompanyProfilePage = lazy(() =>
    import('@/features/employer/pages/CompanyProfilePage').then((m) => ({ default: m.CompanyProfilePage })),
);
const VerificationPage = lazy(() =>
    import('@/features/employer/pages/VerificationPage').then((m) => ({ default: m.VerificationPage })),
);
const EmployerJobsPage = lazy(() => import('@/features/employer/pages/JobsPage').then((m) => ({ default: m.EmployerJobsPage })));
const EmployerJobFormPage = lazy(() =>
    import('@/features/employer/pages/JobFormPage').then((m) => ({ default: m.EmployerJobFormPage })),
);
const ApplicantsPage = lazy(() =>
    import('@/features/employer/pages/ApplicantsPage').then((m) => ({ default: m.ApplicantsPage })),
);
const EmployerInterviewsPage = lazy(() =>
    import('@/features/employer/pages/InterviewsPage').then((m) => ({ default: m.EmployerInterviewsPage })),
);
const EmployerAnalyticsPage = lazy(() =>
    import('@/features/employer/pages/AnalyticsPage').then((m) => ({ default: m.EmployerAnalyticsPage })),
);
const TeamPage = lazy(() => import('@/features/employer/pages/TeamPage').then((m) => ({ default: m.TeamPage })));

const JobSeekerDashboardPage = lazy(() =>
    import('@/features/job-seeker/pages/DashboardPage').then((m) => ({ default: m.JobSeekerDashboardPage })),
);
const JobSearchPage = lazy(() =>
    import('@/features/job-seeker/pages/JobSearchPage').then((m) => ({ default: m.JobSearchPage })),
);
const JobSeekerApplicationsPage = lazy(() =>
    import('@/features/job-seeker/pages/ApplicationsPage').then((m) => ({ default: m.JobSeekerApplicationsPage })),
);
const SavedJobsPage = lazy(() =>
    import('@/features/job-seeker/pages/SavedJobsPage').then((m) => ({ default: m.SavedJobsPage })),
);
const JobSeekerInterviewsPage = lazy(() =>
    import('@/features/job-seeker/pages/InterviewsPage').then((m) => ({ default: m.JobSeekerInterviewsPage })),
);
const ProfilePage = lazy(() => import('@/features/job-seeker/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const ResumePage = lazy(() => import('@/features/job-seeker/pages/ResumePage').then((m) => ({ default: m.ResumePage })));
const ResumeBuilderPage = lazy(() =>
    import('@/features/job-seeker/pages/ResumeBuilderPage').then((m) => ({ default: m.ResumeBuilderPage })),
);
const RecommendationsPage = lazy(() =>
    import('@/features/job-seeker/pages/RecommendationsPage').then((m) => ({ default: m.RecommendationsPage })),
);

const NotificationsPage = lazy(() =>
    import('@/features/notifications/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })),
);
const ProfileSettingsPage = lazy(() =>
    import('@/features/settings/pages/ProfileSettingsPage').then((m) => ({ default: m.ProfileSettingsPage })),
);
const AccountSettingsPage = lazy(() =>
    import('@/features/settings/pages/AccountSettingsPage').then((m) => ({ default: m.AccountSettingsPage })),
);

function LazyPage({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<LoadingSpinner label="Loading..." className="min-h-[50vh]" />}>{children}</Suspense>;
}

const jobSeekerRoutes = [
    { path: JOB_SEEKER_PATHS.dashboard, element: <JobSeekerDashboardPage /> },
    { path: JOB_SEEKER_PATHS.jobs, element: <JobSearchPage /> },
    { path: `${JOB_SEEKER_PATHS.jobs}/:uuid`, element: <JobDetailPage /> },
    { path: JOB_SEEKER_PATHS.applications, element: <JobSeekerApplicationsPage /> },
    { path: JOB_SEEKER_PATHS.savedJobs, element: <SavedJobsPage /> },
    { path: JOB_SEEKER_PATHS.interviews, element: <JobSeekerInterviewsPage /> },
    { path: JOB_SEEKER_PATHS.profile, element: <ProfilePage /> },
    { path: JOB_SEEKER_PATHS.resume, element: <ResumePage /> },
    { path: `${JOB_SEEKER_PATHS.resume}/:uuid/builder`, element: <ResumeBuilderPage /> },
    { path: JOB_SEEKER_PATHS.recommendations, element: <RecommendationsPage /> },
];

const legacyJobSeekerRedirects = [
    { from: '/job-seeker', to: JOB_SEEKER_PATHS.dashboard },
    { from: '/job-seeker/jobs', to: JOB_SEEKER_PATHS.jobs },
    { from: '/job-seeker/applications', to: JOB_SEEKER_PATHS.applications },
    { from: '/job-seeker/saved-jobs', to: JOB_SEEKER_PATHS.savedJobs },
    { from: '/job-seeker/interviews', to: JOB_SEEKER_PATHS.interviews },
    { from: '/job-seeker/profile', to: JOB_SEEKER_PATHS.profile },
    { from: '/job-seeker/resume', to: JOB_SEEKER_PATHS.resume },
    { from: '/job-seeker/recommendations', to: JOB_SEEKER_PATHS.recommendations },
];

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            { path: '/', element: <LazyPage><HomePage /></LazyPage> },
            { path: '/about', element: <LazyPage><AboutPage /></LazyPage> },
            { path: '/contact', element: <LazyPage><ContactPage /></LazyPage> },
            { path: '/faq', element: <LazyPage><FAQPage /></LazyPage> },
            { path: '/privacy', element: <LazyPage><PrivacyPage /></LazyPage> },
            { path: '/terms', element: <LazyPage><TermsPage /></LazyPage> },
            { path: '/companies', element: <LazyPage><CompaniesPage /></LazyPage> },
            { path: '/companies/:slug', element: <LazyPage><CompanyDetailPage /></LazyPage> },
            { path: '/jobs', element: <LazyPage><JobListPage /></LazyPage> },
            { path: '/jobs/:uuid', element: <LazyPage><JobDetailPage /></LazyPage> },
        ],
    },
    {
        element: <GuestRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: '/login', element: <LazyPage><LoginPage /></LazyPage> },
                    { path: '/register', element: <LazyPage><RegisterPage /></LazyPage> },
                    { path: '/forgot-password', element: <LazyPage><ForgotPasswordPage /></LazyPage> },
                    { path: '/reset-password', element: <LazyPage><ResetPasswordPage /></LazyPage> },
                    { path: '/accept-team-invite', element: <LazyPage><AcceptTeamInvitePage /></LazyPage> },
                    { path: '/verify-email', element: <LazyPage><VerifyEmailPage /></LazyPage> },
                ],
            },
        ],
    },
    {
        element: <AdminGuestRoute />,
        children: [{ path: '/admin/login', element: <LazyPage><AdminLoginPage /></LazyPage> }],
    },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/notifications', element: <LazyPage><NotificationsPage /></LazyPage> },
            { path: '/settings/profile', element: <LazyPage><ProfileSettingsPage /></LazyPage> },
            { path: '/settings/account', element: <LazyPage><AccountSettingsPage /></LazyPage> },
            {
                element: <RoleRoute allowedRoles={[ROLES.ADMIN]} />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            { path: '/admin/dashboard', element: <LazyPage><AdminDashboardPage /></LazyPage> },
                            { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
                            { path: '/admin/admins', element: <LazyPage><AdminAdminsPage /></LazyPage> },
                            { path: '/admin/users', element: <LazyPage><AdminUsersPage /></LazyPage> },
                            { path: '/admin/users/:uuid', element: <LazyPage><AdminUserDetailPage /></LazyPage> },
                            { path: '/admin/companies', element: <LazyPage><AdminCompaniesPage /></LazyPage> },
                            { path: '/admin/companies/:uuid', element: <LazyPage><AdminCompanyDetailPage /></LazyPage> },
                            { path: '/admin/jobs', element: <LazyPage><AdminJobsPage /></LazyPage> },
                            { path: '/admin/verifications', element: <LazyPage><AdminVerificationsPage /></LazyPage> },
                            { path: '/admin/interviews', element: <LazyPage><AdminInterviewsPage /></LazyPage> },
                            { path: '/admin/analytics', element: <LazyPage><AdminAnalyticsPage /></LazyPage> },
                            { path: '/admin/activity-logs', element: <LazyPage><AdminActivityLogsPage /></LazyPage> },
                            { path: '/admin/settings', element: <LazyPage><AdminSettingsPage /></LazyPage> },
                        ],
                    },
                ],
            },
            {
                element: <RoleRoute allowedRoles={[ROLES.EMPLOYER]} />,
                children: [
                    {
                        element: <EmployerLayout />,
                        children: [
                            { path: '/employer', element: <LazyPage><EmployerDashboardPage /></LazyPage> },
                            { path: '/employer/company', element: <LazyPage><CompanyProfilePage /></LazyPage> },
                            { path: '/employer/verification', element: <LazyPage><VerificationPage /></LazyPage> },
                            { path: '/employer/jobs', element: <LazyPage><EmployerJobsPage /></LazyPage> },
                            { path: '/employer/jobs/new', element: <LazyPage><EmployerJobFormPage /></LazyPage> },
                            { path: '/employer/jobs/:uuid/edit', element: <LazyPage><EmployerJobFormPage /></LazyPage> },
                            { path: '/employer/applicants', element: <LazyPage><ApplicantsPage /></LazyPage> },
                            { path: '/employer/interviews', element: <LazyPage><EmployerInterviewsPage /></LazyPage> },
                            { path: '/employer/team', element: <LazyPage><TeamPage /></LazyPage> },
                            { path: '/employer/analytics', element: <LazyPage><EmployerAnalyticsPage /></LazyPage> },
                        ],
                    },
                ],
            },
            {
                element: <RoleRoute allowedRoles={[ROLES.JOB_SEEKER]} />,
                children: [
                    {
                        element: <JobSeekerLayout />,
                        children: jobSeekerRoutes.map((route) => ({
                            ...route,
                            element: <LazyPage>{route.element}</LazyPage>,
                        })),
                    },
                ],
            },
        ],
    },
    ...legacyJobSeekerRedirects.map(({ from, to }) => ({
        path: from,
        element: <Navigate to={to} replace />,
    })),
    { path: '/job-seeker/jobs/:uuid', element: <LegacyJobDetailRedirect /> },
    { path: '/job-seeker/resume/:uuid/builder', element: <LegacyResumeBuilderRedirect /> },
    { path: '*', element: <Navigate to="/" replace /> },
]);
