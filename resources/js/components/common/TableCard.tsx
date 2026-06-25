import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TableCardProps {
    toolbar?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export function TableCard({ toolbar, children, footer, className }: TableCardProps) {
    return (
        <div className={cn('overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm', className)}>
            {toolbar && (
                <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    {toolbar}
                </div>
            )}
            {children}
            {footer && <div className="border-t border-border/60 px-4">{footer}</div>}
        </div>
    );
}
