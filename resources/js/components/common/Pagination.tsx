import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types/api';

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <p className="text-sm text-muted-foreground">
                Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page <= 1}
                    onClick={() => onPageChange(meta.current_page - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => onPageChange(meta.current_page + 1)}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
