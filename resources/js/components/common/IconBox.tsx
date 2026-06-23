import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { withIconDefaults } from '@/lib/icon-config';

type IconBoxVariant = 'default' | 'primary' | 'success' | 'warning' | 'muted';

interface IconBoxProps {
    icon: LucideIcon;
    variant?: IconBoxVariant;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const variantStyles: Record<IconBoxVariant, string> = {
    default: 'bg-muted text-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    muted: 'bg-muted/60 text-muted-foreground',
};

const boxSizes = {
    sm: 'h-8 w-8 rounded-lg [&_svg]:h-4 [&_svg]:w-4',
    md: 'h-10 w-10 rounded-xl [&_svg]:h-5 [&_svg]:w-5',
    lg: 'h-12 w-12 rounded-xl [&_svg]:h-6 [&_svg]:w-6',
};

export function IconBox({ icon: Icon, variant = 'muted', size = 'md', className }: IconBoxProps) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center transition-colors',
                variantStyles[variant],
                boxSizes[size],
                className,
            )}
        >
            <Icon {...withIconDefaults()} />
        </div>
    );
}
