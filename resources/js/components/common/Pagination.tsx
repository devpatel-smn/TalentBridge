import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types/api';
import { cn } from '@/lib/utils';

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    className?: string;
}

function getPageNumbers(current: number, last: number): (number | 'ellipsis')[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

    const pages: (number | 'ellipsis')[] = [1];
    if (current > 3) pages.push('ellipsis');

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < last - 2) pages.push('ellipsis');
    if (last > 1) pages.push(last);

    return pages;
}

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    const pages = getPageNumbers(meta.current_page, meta.last_page);

    return (
        <div className={cn('flex flex-col gap-4 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between', className)}>
            <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{meta.from ?? 0}</span>–
                <span className="font-medium text-foreground">{meta.to ?? 0}</span> of{' '}
                <span className="font-medium text-foreground">{meta.total.toLocaleString()}</span> results
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page <= 1}
                    onClick={() => onPageChange(meta.current_page - 1)}
                    className="h-8 gap-1 rounded-lg px-2.5"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-0.5 px-1">
                    {pages.map((page, i) =>
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
                                …
                            </span>
                        ) : (
                            <Button
                                key={page}
                                variant={page === meta.current_page ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="h-8 min-w-8 rounded-lg px-2 text-sm"
                            >
                                {page}
                            </Button>
                        ),
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => onPageChange(meta.current_page + 1)}
                    className="h-8 gap-1 rounded-lg px-2.5"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
