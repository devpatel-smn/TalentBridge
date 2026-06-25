export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';
export type VerificationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'resubmission_required';
export type JobStatus = 'draft' | 'published' | 'closed' | 'archived';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary' | 'freelance';
export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type ApplicationStatus =
    | 'submitted'
    | 'under_review'
    | 'shortlisted'
    | 'interview_scheduled'
    | 'interviewed'
    | 'offered'
    | 'hired'
    | 'rejected'
    | 'withdrawn';
export type InterviewStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'panel' | 'hr';

export interface EmployerContext {
    company_id: number;
    company_uuid: string;
    company_name: string;
    company_slug: string;
    is_primary: boolean;
    is_active: boolean;
}

export interface TeamMember {
    id: number;
    job_title: string | null;
    is_primary: boolean;
    is_active: boolean;
    invite_pending?: boolean;
    joined_at: string | null;
    user?: {
        uuid: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
    };
    invited_by?: {
        uuid: string;
        full_name: string;
    } | null;
    created_at?: string;
    updated_at?: string;
}

export interface InviteTeamMemberPayload {
    email: string;
    job_title?: string | null;
    is_primary?: boolean;
}

export interface UpdateTeamMemberPayload {
    job_title?: string | null;
    is_primary?: boolean;
    is_active?: boolean;
}

export interface User {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string | null;
    status: UserStatus;
    email_verified_at: string | null;
    timezone: string;
    locale: string;
    last_login_at: string | null;
    roles: string[];
    permissions: string[];
    job_seeker_profile?: {
        uuid: string;
        profile_completion: number;
    };
    employer_context?: EmployerContext[];
    created_at: string;
    updated_at: string;
}

export interface Company {
    uuid: string;
    name: string;
    slug: string;
    description?: string | null;
    website?: string | null;
    industry?: string | null;
    company_size?: string | null;
    founded_year?: number | null;
    headquarters?: string | null;
    verification_status: VerificationStatus;
    verified_at?: string | null;
    social_links?: Record<string, string> | null;
    settings?: Record<string, unknown> | null;
    created_at?: string;
    updated_at?: string;
}

export interface JobCategory {
    id: number;
    name: string;
    slug: string;
    parent_id?: number | null;
}

export interface JobSkill {
    id: number;
    name: string;
    is_required?: boolean;
}

export interface Job {
    uuid: string;
    title: string;
    slug: string;
    description?: string;
    requirements?: string | null;
    responsibilities?: string | null;
    benefits?: string | null;
    employment_type: EmploymentType;
    work_mode: WorkMode;
    experience_level?: string | null;
    salary_min?: number | null;
    salary_max?: number | null;
    salary_currency?: string;
    salary_period?: string;
    is_salary_visible?: boolean;
    location_city?: string | null;
    location_state?: string | null;
    location_country?: string | null;
    application_deadline?: string | null;
    vacancies?: number;
    status: JobStatus;
    published_at?: string | null;
    closed_at?: string | null;
    views_count?: number;
    applications_count?: number;
    company?: Company | null;
    category?: JobCategory | null;
    skills?: JobSkill[];
    created_at?: string;
    updated_at?: string;
}

export interface JobApplication {
    uuid: string;
    status: ApplicationStatus;
    cover_letter?: string | null;
    employer_notes?: string | null;
    rejection_reason?: string | null;
    applied_at: string;
    status_changed_at?: string | null;
    job?: Job;
    resume?: { uuid: string; title: string } | null;
    job_seeker_profile?: {
        uuid: string;
        headline?: string;
        user?: { full_name: string; email: string };
    };
    candidate?: {
        uuid: string;
        headline?: string;
        user?: { full_name: string; email: string };
    };
    status_history?: ApplicationStatusHistory[];
}

export interface ApplicationStatusHistory {
    id: number;
    from_status: ApplicationStatus | null;
    to_status: ApplicationStatus;
    notes?: string | null;
    changed_by?: { full_name: string };
    created_at: string;
}

export interface Interview {
    uuid: string;
    interview_type: InterviewType;
    status: InterviewStatus;
    title?: string | null;
    scheduled_at: string;
    duration_minutes: number;
    timezone: string;
    location?: string | null;
    meeting_link?: string | null;
    instructions?: string | null;
    feedback?: string | null;
    rating?: number | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
    company?: { uuid: string; name: string; slug?: string };
    job_application?: JobApplication & {
        candidate?: {
            uuid: string;
            headline?: string | null;
            user?: { uuid: string; full_name: string; email: string };
        };
    };
    scheduler?: { uuid: string; full_name: string };
    participants?: InterviewParticipant[];
    status_history?: InterviewStatusHistory[];
    created_at?: string;
    updated_at?: string;
}

export interface InterviewStatusHistory {
    from_status: InterviewStatus | null;
    to_status: InterviewStatus;
    notes?: string | null;
    changed_by?: { uuid: string; full_name: string } | null;
    created_at: string;
}

export interface ScheduleInterviewPayload {
    application_uuid: string;
    interview_type: InterviewType;
    scheduled_at: string;
    timezone: string;
    title?: string;
    duration_minutes?: number;
    location?: string;
    meeting_link?: string;
    instructions?: string;
}

export interface RescheduleInterviewPayload {
    scheduled_at: string;
    timezone?: string;
    duration_minutes?: number;
    location?: string;
    meeting_link?: string;
    instructions?: string;
    title?: string;
    notes?: string;
}

export interface InterviewParticipant {
    id: number;
    role: string;
    response_status: string;
    user?: { full_name: string; email: string };
}

export interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        body: string;
        action_url?: string;
        icon?: string;
    };
    read_at: string | null;
    created_at: string;
}

export interface NotificationPreference {
    notification_type: string;
    channel_mail: boolean;
    channel_database: boolean;
    channel_push: boolean;
}

export interface JobSeekerProfile {
    uuid: string;
    headline?: string | null;
    summary?: string | null;
    current_title?: string | null;
    years_of_experience?: number | null;
    expected_salary_min?: number | null;
    expected_salary_max?: number | null;
    salary_currency?: string;
    preferred_work_mode?: WorkMode | null;
    preferred_employment_type?: EmploymentType | null;
    willing_to_relocate?: boolean;
    location_city?: string | null;
    location_state?: string | null;
    location_country?: string | null;
    linkedin_url?: string | null;
    portfolio_url?: string | null;
    profile_completion: number;
    is_open_to_work?: boolean;
    is_profile_public?: boolean;
}

export interface Resume {
    uuid: string;
    title: string;
    template_key: string;
    is_primary: boolean;
    source: 'upload' | 'builder';
    sections?: ResumeSection[];
    created_at?: string;
    updated_at?: string;
}

export interface ResumeSection {
    id?: number;
    section_type: string;
    title?: string | null;
    content: Record<string, unknown>;
    sort_order: number;
    is_visible: boolean;
}

export interface DashboardMetric {
    label: string;
    value: number | string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export interface SystemSetting {
    key: string;
    value: unknown;
    group: string;
    description?: string | null;
}
