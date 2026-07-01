import { Building2 } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';

type CompanyAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<CompanyAvatarSize, { container: string; text: string; icon: string }> = {
    sm: { container: 'h-10 w-10 rounded-xl', text: 'text-xs', icon: 'h-4 w-4' },
    md: { container: 'h-12 w-12 rounded-xl', text: 'text-sm', icon: 'h-5 w-5' },
    lg: { container: 'h-14 w-14 rounded-2xl', text: 'text-base', icon: 'h-6 w-6' },
    xl: { container: 'h-16 w-16 rounded-2xl', text: 'text-lg', icon: 'h-7 w-7' },
};

interface CompanyAvatarProps {
    name: string;
    size?: CompanyAvatarSize;
    className?: string;
}

export function CompanyAvatar({ name, size = 'md', className }: CompanyAvatarProps) {
    const sizes = sizeClasses[size];

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center border border-gold/20 bg-gold/8 font-semibold text-gold transition-colors duration-300',
                sizes.container,
                sizes.text,
                className,
            )}
            aria-hidden
        >
            {name ? (
                <span>{getInitials(name)}</span>
            ) : (
                <Building2 className={sizes.icon} strokeWidth={1.5} />
            )}
        </div>
    );
}
