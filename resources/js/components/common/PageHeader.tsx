import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/common/Breadcrumbs';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

export function PageHeader({ title, description, actions, breadcrumbs, className }: PageHeaderProps) {
    return (
        <div className={cn('space-y-4', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
                    {description && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}
