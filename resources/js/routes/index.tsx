import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import { JobSeekerLayout } from '@/components/layout/JobSeekerLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { GuestRoute } from '@/routes/GuestRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { ROLES } from '@/lib/constants';

import { AdminDashboardPage } from '@/features/admin/pages/DashboardPage';
import { AdminUsersPage } from '@/features/admin/pages/UsersPage';
import { AdminCompaniesPage } from '@/features/admin/pages/CompaniesPage';
import { AdminJobsPage } from '@/features/admin/pages/JobsPage';
import { AdminVerificationsPage } from '@/features/admin/pages/VerificationsPage';
import { AdminInterviewsPage } from '@/features/admin/pages/InterviewsPage';
import { AdminAnalyticsPage } from '@/features/admin/pages/AnalyticsPage';
import { AdminActivityLogsPage } from '@/features/admin/pages/ActivityLogsPage';
import { AdminSettingsPage } from '@/features/admin/pages/SettingsPage';

import { EmployerDashboardPage } from '@/features/employer/pages/DashboardPage';
import { CompanyProfilePage } from '@/features/employer/pages/CompanyProfilePage';
import { VerificationPage } from '@/features/employer/pages/VerificationPage';
import { EmployerJobsPage } from '@/features/employer/pages/JobsPage';
import { EmployerJobFormPage } from '@/features/employer/pages/JobFormPage';
import { ApplicantsPage } from '@/features/employer/pages/ApplicantsPage';
import { EmployerInterviewsPage } from '@/features/employer/pages/InterviewsPage';
import { EmployerAnalyticsPage } from '@/features/employer/pages/AnalyticsPage';
import { TeamPage } from '@/features/employer/pages/TeamPage';

import { JobSeekerDashboardPage } from '@/features/job-seeker/pages/DashboardPage';
import { JobSearchPage } from '@/features/job-seeker/pages/JobSearchPage';
import { JobSeekerApplicationsPage } from '@/features/job-seeker/pages/ApplicationsPage';
import { SavedJobsPage } from '@/features/job-seeker/pages/SavedJobsPage';
import { JobSeekerInterviewsPage } from '@/features/job-seeker/pages/InterviewsPage';
import { ProfilePage } from '@/features/job-seeker/pages/ProfilePage';
import { ResumePage } from '@/features/job-seeker/pages/ResumePage';
import { ResumeBuilderPage } from '@/features/job-seeker/pages/ResumeBuilderPage';
import { RecommendationsPage } from '@/features/job-seeker/pages/RecommendationsPage';

import { JobListPage } from '@/features/jobs/pages/JobListPage';
import { JobDetailPage } from '@/features/jobs/pages/JobDetailPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { ProfileSettingsPage } from '@/features/settings/pages/ProfileSettingsPage';
import { AccountSettingsPage } from '@/features/settings/pages/AccountSettingsPage';

export const router = createBrowserRouter([
    {
        element: <GuestRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: '/login', element: <LoginPage /> },
                    { path: '/register', element: <RegisterPage /> },
                    { path: '/forgot-password', element: <ForgotPasswordPage /> },
                    { path: '/reset-password', element: <ResetPasswordPage /> },
                    { path: '/verify-email', element: <VerifyEmailPage /> },
                ],
            },
        ],
    },
    { path: '/jobs', element: <JobListPage /> },
    { path: '/jobs/:uuid', element: <JobDetailPage /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/notifications', element: <NotificationsPage /> },
            { path: '/settings/profile', element: <ProfileSettingsPage /> },
            { path: '/settings/account', element: <AccountSettingsPage /> },
            {
                element: <RoleRoute allowedRoles={[ROLES.ADMIN]} />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            { path: '/admin', element: <AdminDashboardPage /> },
                            { path: '/admin/users', element: <AdminUsersPage /> },
                            { path: '/admin/companies', element: <AdminCompaniesPage /> },
                            { path: '/admin/jobs', element: <AdminJobsPage /> },
                            { path: '/admin/verifications', element: <AdminVerificationsPage /> },
                            { path: '/admin/interviews', element: <AdminInterviewsPage /> },
                            { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
                            { path: '/admin/activity-logs', element: <AdminActivityLogsPage /> },
                            { path: '/admin/settings', element: <AdminSettingsPage /> },
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
                            { path: '/employer', element: <EmployerDashboardPage /> },
                            { path: '/employer/company', element: <CompanyProfilePage /> },
                            { path: '/employer/verification', element: <VerificationPage /> },
                            { path: '/employer/jobs', element: <EmployerJobsPage /> },
                            { path: '/employer/jobs/new', element: <EmployerJobFormPage /> },
                            { path: '/employer/jobs/:uuid/edit', element: <EmployerJobFormPage /> },
                            { path: '/employer/applicants', element: <ApplicantsPage /> },
                            { path: '/employer/interviews', element: <EmployerInterviewsPage /> },
                            { path: '/employer/team', element: <TeamPage /> },
                            { path: '/employer/analytics', element: <EmployerAnalyticsPage /> },
                        ],
                    },
                ],
            },
            {
                element: <RoleRoute allowedRoles={[ROLES.JOB_SEEKER]} />,
                children: [
                    {
                        element: <JobSeekerLayout />,
                        children: [
                            { path: '/job-seeker', element: <JobSeekerDashboardPage /> },
                            { path: '/job-seeker/jobs', element: <JobSearchPage /> },
                            { path: '/job-seeker/jobs/:uuid', element: <JobDetailPage /> },
                            { path: '/job-seeker/applications', element: <JobSeekerApplicationsPage /> },
                            { path: '/job-seeker/saved-jobs', element: <SavedJobsPage /> },
                            { path: '/job-seeker/interviews', element: <JobSeekerInterviewsPage /> },
                            { path: '/job-seeker/profile', element: <ProfilePage /> },
                            { path: '/job-seeker/resume', element: <ResumePage /> },
                            { path: '/job-seeker/resume/:uuid/builder', element: <ResumeBuilderPage /> },
                            { path: '/job-seeker/recommendations', element: <RecommendationsPage /> },
                        ],
                    },
                ],
            },
        ],
    },
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '*', element: <Navigate to="/login" replace /> },
]);
