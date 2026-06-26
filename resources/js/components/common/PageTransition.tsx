import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function PageTransition({ children }: { children: ReactNode }) {
    const location = useLocation();

    return (
        <div key={location.pathname} className={cn('animate-page-enter motion-reduce:animate-none')}>
            {children}
        </div>
    );
}
