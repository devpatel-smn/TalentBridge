import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type RevealVariant = 'fade-up' | 'slide-left' | 'slide-right' | 'clip-up' | 'scale' | 'blur';

interface RevealSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    variant?: RevealVariant;
}

const hiddenStyles: Record<RevealVariant, string> = {
    'fade-up': 'translate-y-10 opacity-0',
    'slide-left': '-translate-x-12 opacity-0',
    'slide-right': 'translate-x-12 opacity-0',
    'clip-up': 'opacity-0 [clip-path:inset(0_0_100%_0)]',
    scale: 'scale-[0.96] opacity-0',
    blur: 'translate-y-6 opacity-0 blur-sm',
};

const visibleStyles: Record<RevealVariant, string> = {
    'fade-up': 'translate-y-0 opacity-100',
    'slide-left': 'translate-x-0 opacity-100',
    'slide-right': 'translate-x-0 opacity-100',
    'clip-up': 'opacity-100 [clip-path:inset(0_0_0_0)]',
    scale: 'scale-100 opacity-100',
    blur: 'translate-y-0 opacity-100 blur-0',
};

export function RevealSection({ children, className, delay = 0, variant = 'fade-up' }: RevealSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const [visible, setVisible] = useState(reducedMotion);

    useEffect(() => {
        if (reducedMotion) return;

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -32px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [reducedMotion]);

    return (
        <div
            ref={ref}
            className={cn(
                'will-change-[transform,opacity]',
                !reducedMotion && 'transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                !reducedMotion && (visible ? visibleStyles[variant] : hiddenStyles[variant]),
                className,
            )}
            style={!reducedMotion && delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

interface StaggerRevealProps {
    children: ReactNode[];
    className?: string;
    itemClassName?: string;
    variant?: RevealVariant;
    staggerMs?: number;
}

export function StaggerReveal({
    children,
    className,
    itemClassName,
    variant = 'fade-up',
    staggerMs = 80,
}: StaggerRevealProps) {
    return (
        <div className={className}>
            {children.map((child, i) => (
                <RevealSection key={i} variant={variant} delay={i * staggerMs} className={itemClassName}>
                    {child}
                </RevealSection>
            ))}
        </div>
    );
}
