import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DetailFieldProps {
    label: string;
    value?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export function DetailField({ label, value, children, className }: DetailFieldProps) {
    return (
        <div className={cn('space-y-1', className)}>
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="text-sm text-foreground">{children ?? value ?? '—'}</dd>
        </div>
    );
}
