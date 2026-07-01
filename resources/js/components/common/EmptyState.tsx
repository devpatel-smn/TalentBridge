import { FolderOpen, TriangleAlert } from 'lucide-react';
import { isValidElement, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { IconBox } from '@/components/common/IconBox';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: LucideIcon | ReactNode;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
    className?: string;
}

function isLucideIcon(icon: unknown): icon is LucideIcon {
    return (
        typeof icon === 'function' ||
        (typeof icon === 'object' && icon !== null && 'render' in icon && '$$typeof' in icon)
    );
}

function renderEmptyIcon(icon: LucideIcon | ReactNode | undefined) {
    if (!icon) {
        return <IconBox icon={FolderOpen} variant="muted" size="lg" className="mb-5" />;
    }
    if (isValidElement(icon)) {
        return <div className="mb-5 flex justify-center">{icon}</div>;
    }
    if (isLucideIcon(icon)) {
        return <IconBox icon={icon} variant="muted" size="lg" className="mb-5" />;
    }
    return <div className="mb-5 flex justify-center">{icon}</div>;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/25 px-6 py-20 text-center',
                className,
            )}
        >
            {renderEmptyIcon(icon)}
            <h3 className="font-display text-lg font-medium tracking-tight">{title}</h3>
            {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>}
            {action && (
                <Button className="mt-6" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}

export function ErrorState({
    title,
    description,
    onRetry,
    className,
}: {
    title: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-20 text-center',
                className,
            )}
        >
            <IconBox icon={TriangleAlert} variant="warning" size="lg" className="mb-5 bg-destructive/10 text-destructive" />
            <h3 className="font-display text-lg font-medium tracking-tight">{title}</h3>
            {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>}
            {onRetry && (
                <Button variant="outline" className="mt-6" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}
