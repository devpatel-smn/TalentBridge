import { Outlet, Link } from 'react-router-dom';
import { BadgeCheck, BriefcaseBusiness, ChartColumnBig, UsersRound } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { IconBox } from '@/components/common/IconBox';
import { PUBLIC_PATHS } from '@/lib/paths';

const highlights = [
    { icon: UsersRound, label: 'Talent network', description: 'Connect with qualified candidates', variant: 'primary' as const },
    { icon: BriefcaseBusiness, label: 'Hiring pipeline', description: 'Track every stage of recruitment', variant: 'default' as const },
    { icon: BadgeCheck, label: 'Verified employers', description: 'Trust-first company verification', variant: 'success' as const },
    { icon: ChartColumnBig, label: 'Hiring analytics', description: 'Data-driven hiring decisions', variant: 'warning' as const },
];

export function AuthLayout() {
    return (
        <div className="relative flex min-h-screen">
            <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden p-10 text-white xl:w-[40%] xl:p-12 lg:flex surface-navy grain-overlay">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(29_84%_61%_/_0.18)_0%,_transparent_60%)]" />
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

                <div className="relative z-10">
                    <Link to={PUBLIC_PATHS.home} className="inline-flex transition-opacity duration-300 hover:opacity-85">
                        <AppLogo size="md" showWordmark variant="light" />
                    </Link>
                </div>

                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <h1 className="font-display text-4xl font-medium leading-[1.15] tracking-tight text-white drop-shadow-sm xl:text-5xl">
                            The modern way to hire and get hired
                        </h1>
                        <p className="max-w-md text-lg leading-relaxed text-white/90">
                            Enterprise recruitment platform for hiring teams and job seekers. Built for scale, designed for people.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {highlights.map(({ icon, label, description, variant }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-white/15 bg-white/12 p-4 backdrop-blur-md transition-colors hover:bg-white/18"
                            >
                                <IconBox icon={icon} variant={variant} size="sm" className="mb-3 bg-white/20 text-white" />
                                <p className="text-sm font-semibold text-white">{label}</p>
                                <p className="mt-0.5 text-xs text-white/75">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-sm text-white/60">© {new Date().getFullYear()} TalentBridge</p>
            </div>

            <div className="flex w-full flex-col items-center justify-center bg-background px-4 py-10 sm:px-6 sm:py-12 lg:w-[58%] lg:px-10 lg:py-14 xl:w-[60%]">
                <div className="w-full max-w-[500px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-2">
                    <div className="px-8 py-10 sm:px-10 sm:py-12">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
