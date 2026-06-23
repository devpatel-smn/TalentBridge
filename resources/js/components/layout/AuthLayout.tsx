import { Outlet } from 'react-router-dom';
import { BadgeCheck, BriefcaseBusiness, ChartColumnBig, UsersRound } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { IconBox } from '@/components/common/IconBox';

const highlights = [
    { icon: UsersRound, label: 'Talent network', variant: 'primary' as const },
    { icon: BriefcaseBusiness, label: 'Hiring pipeline', variant: 'default' as const },
    { icon: BadgeCheck, label: 'Verified employers', variant: 'success' as const },
    { icon: ChartColumnBig, label: 'Hiring analytics', variant: 'warning' as const },
];

export function AuthLayout() {
    return (
        <div className="relative flex min-h-screen">
            <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-primary via-primary/90 to-violet-700 p-12 text-white lg:flex">
                <AppLogo size="md" showWordmark variant="light" />

                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-tight">
                            Connect talent with opportunity
                        </h1>
                        <p className="max-w-md text-lg text-white/80">
                            The enterprise recruitment platform for hiring teams and job seekers.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {highlights.map(({ icon, label, variant }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                            >
                                <IconBox icon={icon} variant={variant} size="sm" className="bg-white/15 text-white" />
                                <span className="text-sm font-medium text-white/90">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-sm text-white/60">© {new Date().getFullYear()} TalentBridge</p>
            </div>
            <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
