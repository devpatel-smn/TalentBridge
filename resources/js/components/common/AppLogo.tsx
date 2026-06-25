import { cn } from '@/lib/utils';

interface AppLogoProps {
    size?: 'sm' | 'md' | 'lg';
    showWordmark?: boolean;
    variant?: 'default' | 'light';
    className?: string;
}

const sizes = {
    sm: { box: 'h-8 w-8', svg: 18, text: 'text-base' },
    md: { box: 'h-10 w-10', svg: 22, text: 'text-lg' },
    lg: { box: 'h-12 w-12', svg: 26, text: 'text-xl' },
};

export function AppLogo({ size = 'md', showWordmark = false, variant = 'default', className }: AppLogoProps) {
    const s = sizes[size];

    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            <div
                className={cn(
                    'relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm',
                    variant === 'light'
                        ? 'bg-white/15 ring-1 ring-white/25 backdrop-blur-sm'
                        : 'gradient-brand shadow-elevation-1',
                    s.box,
                )}
            >
                <svg
                    width={s.svg}
                    height={s.svg}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="text-white"
                >
                    <path
                        d="M4 16c3.5-2 5.5-2 8 0s4.5 2 8 0"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                    />
                    <path
                        d="M6 16V9.5c0-1.1.9-2 2-2h1.5M18 16V9.5c0-1.1-.9-2-2-2h-1.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                    />
                    <circle cx="8" cy="7" r="1.75" fill="currentColor" />
                    <circle cx="16" cy="7" r="1.75" fill="currentColor" />
                    <path d="M10 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
            </div>
            {showWordmark && (
                <span
                    className={cn(
                        'font-bold tracking-tight',
                        s.text,
                        variant === 'light' ? 'text-white' : 'text-gradient',
                    )}
                >
                    TalentBridge
                </span>
            )}
        </div>
    );
}
