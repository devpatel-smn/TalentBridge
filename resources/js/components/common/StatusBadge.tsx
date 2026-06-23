import type { VariantProps } from 'class-variance-authority';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { titleCase } from '@/lib/utils';

const statusVariantMap: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
    active: 'success',
    published: 'success',
    approved: 'success',
    hired: 'success',
    completed: 'success',
    confirmed: 'success',
    shortlisted: 'default',
    under_review: 'warning',
    pending: 'warning',
    pending_verification: 'warning',
    scheduled: 'default',
    interview_scheduled: 'default',
    draft: 'secondary',
    inactive: 'secondary',
    suspended: 'destructive',
    rejected: 'destructive',
    cancelled: 'destructive',
    withdrawn: 'secondary',
    closed: 'secondary',
    archived: 'secondary',
};

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const variant = statusVariantMap[status] ?? 'outline';
    return (
        <Badge variant={variant} className={className}>
            {titleCase(status)}
        </Badge>
    );
}
