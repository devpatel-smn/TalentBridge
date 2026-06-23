import type { LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBox } from '@/components/common/IconBox';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { withIconDefaults } from '@/lib/icon-config';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: ReactNode | LucideIcon;
    iconVariant?: 'default' | 'primary' | 'success' | 'warning' | 'muted';
    trend?: 'up' | 'down' | 'neutral';
    change?: string;
    isLoading?: boolean;
    className?: string;
}

function renderIcon(icon: ReactNode | LucideIcon | undefined, variant: StatCardProps['iconVariant']) {
    if (!icon) return null;
    if (typeof icon === 'function') {
        const Icon = icon;
        return <IconBox icon={Icon} variant={variant ?? 'primary'} size="sm" />;
    }
    return icon;
}

export function StatCard({
    title,
    value,
    description,
    icon,
    iconVariant = 'primary',
    trend,
    change,
    isLoading,
    className,
}: StatCardProps) {
    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn('transition-all duration-300 hover:shadow-md', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon && <div>{renderIcon(icon, iconVariant)}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                {(description || change) && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {trend === 'up' && <TrendingUp {...withIconDefaults({ className: 'h-3 w-3 text-success' })} />}
                        {trend === 'down' && <TrendingDown {...withIconDefaults({ className: 'h-3 w-3 text-destructive' })} />}
                        {change && <span>{change}</span>}
                        {description && <span>{description}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
