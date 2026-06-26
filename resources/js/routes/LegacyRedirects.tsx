import { Navigate, useParams } from 'react-router-dom';
import { JOB_SEEKER_PATHS } from '@/lib/paths';

export function LegacyJobDetailRedirect() {
    const { uuid } = useParams<{ uuid: string }>();
    return <Navigate to={JOB_SEEKER_PATHS.job(uuid ?? '')} replace />;
}

export function LegacyResumeBuilderRedirect() {
    const { uuid } = useParams<{ uuid: string }>();
    return <Navigate to={JOB_SEEKER_PATHS.resumeBuilder(uuid ?? '')} replace />;
}
