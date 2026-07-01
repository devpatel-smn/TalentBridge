import { cn } from '@/lib/utils';

interface AppLogoProps {
    size?: 'sm' | 'md' | 'lg';
    showWordmark?: boolean;
    variant?: 'default' | 'light';
    className?: string;
}

const sizes = {
    sm: { box: 'h-11 w-11', svg: 20, text: 'text-[1.0625rem]' },
    md: { box: 'h-12 w-12', svg: 22, text: 'text-[1.2rem]' },
    lg: { box: 'h-14 w-14', svg: 26, text: 'text-[1.45rem]' },
};

function LogoMark({ size, variant }: { size: number; variant: 'default' | 'light' }) {
    const gradientId = `tb-mark-${variant}`;
    const accent = variant === 'light' ? '#ef9846' : '#d47a2a';

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
                <linearGradient id={gradientId} x1="4" y1="5" x2="20" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stopColor={variant === 'light' ? '#FFFFFF' : '#f9f5ee'} />
                    <stop offset="1" stopColor={variant === 'light' ? '#fde4d2' : '#f3ece0'} />
                </linearGradient>
            </defs>
            <rect x="5.5" y="6.5" width="3" height="11" rx="1.5" fill={`url(#${gradientId})`} />
            <rect x="15.5" y="6.5" width="3" height="11" rx="1.5" fill={`url(#${gradientId})`} />
            <path
                d="M8.75 11.25h6.5M8.75 13.75h6.5"
                stroke={accent}
                strokeWidth="1.35"
                strokeLinecap="round"
            />
            <path
                d="M7.25 17.25c2.1-1.15 3.65-1.75 4.75-1.75s2.65.6 4.75 1.75"
                stroke={`url(#${gradientId})`}
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <circle cx="7" cy="5.75" r="1.35" fill={accent} />
            <circle cx="17" cy="5.75" r="1.35" fill={accent} />
        </svg>
    );
}

export function AppLogo({ size = 'md', showWordmark = false, variant = 'default', className }: AppLogoProps) {
    const s = sizes[size];

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div
                className={cn(
                    'relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl',
                    variant === 'light'
                        ? 'bg-white/10 ring-1 ring-white/15 shadow-[0_10px_28px_-18px_rgba(255,255,255,0.55)]'
                        : 'bg-navy shadow-elevation-1 ring-1 ring-navy/10',
                    s.box,
                )}
            >
                <LogoMark size={s.svg} variant={variant} />
            </div>
            {showWordmark && (
                <span
                    className={cn(
                        'font-display font-medium tracking-tight',
                        s.text,
                        variant === 'light' ? 'text-white' : 'text-foreground',
                    )}
                >
                    Talent<span className="text-accent-gold">Bridge</span>
                </span>
            )}
        </div>
    );
}
