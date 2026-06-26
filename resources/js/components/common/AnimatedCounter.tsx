import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
    value: string;
    className?: string;
    duration?: number;
}

function parseStatValue(raw: string): { num: number; prefix: string; suffix: string; decimals: number } {
    const match = raw.match(/^([^0-9.-]*)([0-9,.]+)(.*)$/);
    if (!match) return { num: 0, prefix: '', suffix: raw, decimals: 0 };

    const [, prefix, numStr, suffix] = match;
    const cleaned = numStr.replace(/,/g, '');
    const decimals = cleaned.includes('.') ? cleaned.split('.')[1]?.length ?? 0 : 0;
    return { num: parseFloat(cleaned), prefix, suffix, decimals };
}

function formatNumber(num: number, decimals: number): string {
    if (decimals > 0) return num.toFixed(decimals);
    return Math.round(num).toLocaleString();
}

export function AnimatedCounter({ value, className, duration = 1800 }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const reducedMotion = useReducedMotion();
    const [display, setDisplay] = useState(value);
    const { num, prefix, suffix, decimals } = parseStatValue(value);

    useEffect(() => {
        if (reducedMotion || num === 0) {
            setDisplay(value);
            return;
        }

        const el = ref.current;
        if (!el) return;

        let frame = 0;
        let start = 0;
        let observer: IntersectionObserver;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(`${prefix}${formatNumber(num * eased, decimals)}${suffix}`);
            if (progress < 1) frame = requestAnimationFrame(animate);
        };

        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    frame = requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 },
        );

        observer.observe(el);
        return () => {
            observer?.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [value, num, prefix, suffix, decimals, duration, reducedMotion]);

    return (
        <span ref={ref} className={cn('tabular-nums', className)}>
            {display}
        </span>
    );
}
