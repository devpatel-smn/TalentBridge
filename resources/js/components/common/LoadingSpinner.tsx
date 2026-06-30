import { cn } from '@/lib/utils';
import { AppLogo } from '@/components/common/AppLogo';

export function LoadingSpinner({ className, label = 'Loading...' }: { className?: string; label?: string }) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-4 py-20', className)} role="status" aria-live="polite">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                <div className="relative animate-pulse motion-reduce:animate-none">
                    <AppLogo size="md" />
                </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
    );
}
