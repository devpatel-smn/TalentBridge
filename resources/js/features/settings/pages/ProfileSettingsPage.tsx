import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, Settings, Shield } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ROUTES, ROLES } from '@/lib/constants';
import { formatDate, getInitials, titleCase } from '@/lib/utils';

export function ProfileSettingsPage() {
    const { user, role } = useAuth();

    if (!user) return null;

    const roleLabel =
        role === ROLES.ADMIN ? 'Administrator' : role === ROLES.EMPLOYER ? 'Employer' : 'Job Seeker';
    const dashboardHref = role ? DASHBOARD_ROUTES[role] : '/';

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6">
                <PageHeader
                    title="Profile"
                    description="Your account information and preferences."
                    actions={
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                                <Link to={dashboardHref}>Dashboard</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link to="/settings/account">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Account settings
                                </Link>
                            </Button>
                        </div>
                    }
                />

                <div className="mt-6 space-y-6">
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:items-start">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                                    {getInitials(user.full_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                                <p className="text-muted-foreground">{roleLabel}</p>
                                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                    <StatusBadge status={user.status} />
                                    {user.email_verified_at ? (
                                        <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                                            Email verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning">
                                            Email not verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact details</CardTitle>
                            <CardDescription>How we reach you for important updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <p className="text-sm text-muted-foreground">{user.phone ?? 'Not provided'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Role</p>
                                    <p className="text-sm text-muted-foreground">{titleCase(role ?? '')}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Member since</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(user.created_at)}</p>
                                </div>
                            </div>
                            {user.last_login_at && (
                                <>
                                    <Separator />
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Last login</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(user.last_login_at)}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {role === ROLES.JOB_SEEKER && user.job_seeker_profile && (
                                <>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Profile completion</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.job_seeker_profile.profile_completion}% complete
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" size="sm">
                                            <Link to="/job-seeker/profile">Edit profile</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
