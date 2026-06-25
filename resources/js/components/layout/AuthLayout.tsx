import { Outlet } from 'react-router-dom';
import { BadgeCheck, BriefcaseBusiness, ChartColumnBig, UsersRound } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { IconBox } from '@/components/common/IconBox';

const highlights = [
    { icon: UsersRound, label: 'Talent network', description: 'Connect with qualified candidates', variant: 'primary' as const },
    { icon: BriefcaseBusiness, label: 'Hiring pipeline', description: 'Track every stage of recruitment', variant: 'default' as const },
    { icon: BadgeCheck, label: 'Verified employers', description: 'Trust-first company verification', variant: 'success' as const },
    { icon: ChartColumnBig, label: 'Hiring analytics', description: 'Data-driven hiring decisions', variant: 'warning' as const },
];

export function AuthLayout() {
    return (
        <div className="relative flex min-h-screen">
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex">
                <div className="absolute inset-0 gradient-brand" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

                <div className="relative z-10">
                    <AppLogo size="md" showWordmark variant="light" />
                </div>

                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                            The modern way to hire and get hired
                        </h1>
                        <p className="max-w-md text-lg leading-relaxed text-white/75">
                            Enterprise recruitment platform for hiring teams and job seekers. Built for scale, designed for people.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {highlights.map(({ icon, label, description, variant }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white/15"
                            >
                                <IconBox icon={icon} variant={variant} size="sm" className="mb-3 bg-white/15 text-white" />
                                <p className="text-sm font-semibold text-white">{label}</p>
                                <p className="mt-0.5 text-xs text-white/60">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-sm text-white/50">© {new Date().getFullYear()} TalentBridge</p>
            </div>

            <div className="flex w-full flex-col items-center justify-center bg-background px-4 py-10 sm:px-6 sm:py-12 lg:w-1/2 lg:px-10 lg:py-14">
                <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevation-2">
                    <div className="px-8 py-10 sm:px-10 sm:py-12">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
