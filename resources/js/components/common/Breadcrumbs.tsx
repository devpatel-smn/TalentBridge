import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const location = useLocation();

    return (
        <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
            <Link
                to="/"
                className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Home"
            >
                <Home className="h-3.5 w-3.5" />
            </Link>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isCurrent = isLast || item.href === location.pathname;

                return (
                    <span key={`${item.label}-${index}`} className="flex items-center gap-1">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
                        {item.href && !isCurrent ? (
                            <Link
                                to={item.href}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={cn(isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                                {item.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
