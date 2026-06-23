import { FolderOpen, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconBox } from '@/components/common/IconBox';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon = FolderOpen, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center">
            <IconBox icon={Icon} variant="muted" size="lg" className="mb-4" />
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
            {action && (
                <Button className="mt-6" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}

export function ErrorState({ title, description, onRetry }: { title: string; description?: string; onRetry?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center">
            <IconBox icon={TriangleAlert} variant="warning" size="lg" className="mb-4 bg-destructive/10 text-destructive" />
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
            {onRetry && (
                <Button variant="outline" className="mt-6" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}
