import type { LucideIcon } from 'lucide-react';
import { isValidElement, type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBox } from '@/components/common/IconBox';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
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

function isLucideIcon(icon: unknown): icon is LucideIcon {
    return (
        typeof icon === 'function' ||
        (typeof icon === 'object' && icon !== null && 'render' in icon && '$$typeof' in icon)
    );
}

function renderIcon(icon: ReactNode | LucideIcon | undefined, variant: StatCardProps['iconVariant']) {
    if (!icon) return null;
    if (isValidElement(icon)) return icon;
    if (isLucideIcon(icon)) {
        return <IconBox icon={icon} variant={variant ?? 'primary'} size="sm" />;
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
            <Card className={cn('h-full min-h-[8.75rem] overflow-hidden', className)}>
                <CardContent className="flex h-full flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const footerText = description || change;

    return (
        <Card
            className={cn(
                'card-glow-hover h-full min-h-[8.75rem] overflow-hidden border-border/70 bg-card',
                className,
            )}
        >
            <CardContent className="flex h-full min-h-[8.75rem] flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-muted-foreground">
                        {title}
                    </p>
                    {icon && <div className="shrink-0">{renderIcon(icon, iconVariant)}</div>}
                </div>

                <div className="mt-3">
                    <p className="font-display text-2xl font-medium tracking-tight tabular-nums text-foreground">
                        {value}
                    </p>
                    <div className="mt-1 flex min-h-[1rem] items-center gap-1.5 text-xs">
                        {trend === 'up' && (
                            <span className="flex items-center gap-0.5 font-medium text-success">
                                <TrendingUp {...withIconDefaults({ className: 'h-3.5 w-3.5' })} />
                                {change}
                            </span>
                        )}
                        {trend === 'down' && (
                            <span className="flex items-center gap-0.5 font-medium text-destructive">
                                <TrendingDown {...withIconDefaults({ className: 'h-3.5 w-3.5' })} />
                                {change}
                            </span>
                        )}
                        {trend === 'neutral' && change && (
                            <span className="flex items-center gap-0.5 font-medium text-muted-foreground">
                                <Minus {...withIconDefaults({ className: 'h-3.5 w-3.5' })} />
                                {change}
                            </span>
                        )}
                        {!trend && change && <span className="font-medium text-muted-foreground">{change}</span>}
                        {description && <span className="line-clamp-1 text-muted-foreground">{description}</span>}
                        {!footerText && <span className="invisible">—</span>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
