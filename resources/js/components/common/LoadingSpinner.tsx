import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, label = 'Loading...' }: { className?: string; label?: string }) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-4 py-20', className)} role="status" aria-live="polite">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                <Loader2 className="relative h-9 w-9 animate-spin text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
    );
}
