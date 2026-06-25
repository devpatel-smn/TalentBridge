import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IconBox } from '@/components/common/IconBox';
import { cn } from '@/lib/utils';

export interface QuickAccessItem {
    href: string;
    label: string;
    description: string;
    icon: LucideIcon;
    iconVariant?: 'default' | 'primary' | 'success' | 'warning' | 'muted';
}

interface QuickAccessPanelProps {
    title?: string;
    description?: string;
    items: QuickAccessItem[];
    className?: string;
}

export function QuickAccessPanel({
    title = 'Quick access',
    description = 'Jump to common tasks and workflows',
    items,
    className,
}: QuickAccessPanelProps) {
    const isCompact = items.length >= 4;

    const gridCols =
        items.length >= 4
            ? 'sm:grid-cols-2 lg:grid-cols-4'
            : items.length === 3
              ? 'sm:grid-cols-2 lg:grid-cols-3'
              : 'sm:grid-cols-2';

    return (
        <section className={cn('overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm', className)}>
            <div className="border-b border-border/60 bg-muted/40 px-5 py-4">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
                {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
            <div className={cn('grid gap-px bg-border/60', gridCols)}>
                {items.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            'group flex items-center bg-card transition-colors hover:bg-muted/50',
                            isCompact ? 'gap-2.5 p-3 lg:gap-3 lg:p-3.5' : 'gap-4 p-4 sm:p-5',
                        )}
                    >
                        <IconBox
                            icon={item.icon}
                            variant={item.iconVariant ?? 'primary'}
                            size={isCompact ? 'sm' : 'md'}
                            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="min-w-0 flex-1">
                            <p className={cn('font-semibold text-foreground', isCompact && 'text-sm')}>
                                {item.label}
                            </p>
                            <p
                                className={cn(
                                    'mt-0.5 text-xs leading-relaxed text-muted-foreground',
                                    isCompact ? 'line-clamp-1' : 'line-clamp-2',
                                )}
                            >
                                {item.description}
                            </p>
                        </div>
                        <ArrowRight
                            className={cn(
                                'shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary',
                                isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4',
                            )}
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
}
