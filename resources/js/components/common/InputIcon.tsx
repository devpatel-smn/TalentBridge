import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { withIconDefaults } from '@/lib/icon-config';

interface InputIconProps {
    icon: LucideIcon;
    className?: string;
}

export function InputIcon({ icon: Icon, className }: InputIconProps) {
    return (
        <Icon
            {...withIconDefaults({ className: cn('h-4 w-4 text-muted-foreground', className) })}
        />
    );
}
