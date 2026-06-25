import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageSectionProps {
    title?: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}

export function PageSection({
    title,
    description,
    actions,
    children,
    className,
    contentClassName,
}: PageSectionProps) {
    return (
        <section className={cn('space-y-4', className)}>
            {(title || actions) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>}
                        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
                    </div>
                    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
                </div>
            )}
            <div className={contentClassName}>{children}</div>
        </section>
    );
}
