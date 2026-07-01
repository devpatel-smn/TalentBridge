import { type ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function PageTransition({ children }: { children: ReactNode }) {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, [location.pathname]);

    return (
        <div key={location.pathname} className={cn('animate-page-enter motion-reduce:animate-none')}>
            {children}
        </div>
    );
}
