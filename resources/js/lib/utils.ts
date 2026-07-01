import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...options,
    }).format(new Date(date));
}

export function formatRelativeDate(date: string | null | undefined): string {
    if (!date) return '';
    const now = Date.now();
    const then = new Date(date).getTime();
    const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(date, { month: 'short', day: 'numeric' });
}

export function formatDateTime(date: string | null | undefined): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(date));
}

export function formatSalary(
    min: number | null | undefined,
    max: number | null | undefined,
    currency = 'USD',
    visible = true,
): string {
    if (!visible || (min == null && max == null)) return 'Competitive';
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    });
    if (min != null && max != null) return `${formatter.format(min)} – ${formatter.format(max)}`;
    if (min != null) return `From ${formatter.format(min)}`;
    if (max != null) return `Up to ${formatter.format(max)}`;
    return 'Competitive';
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function titleCase(value: string): string {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
