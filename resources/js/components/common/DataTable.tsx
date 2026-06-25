import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
    stickyHeader?: boolean;
    variant?: 'default' | 'embedded';
}

export function DataTable<T>({
    columns,
    data,
    isLoading,
    emptyTitle = 'No results found',
    emptyDescription,
    className,
    stickyHeader = true,
    variant = 'default',
}: DataTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className={cn('overflow-hidden rounded-xl border border-border/80 bg-card', className)}>
                <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
                    <div className="flex gap-8">
                        {columns.slice(0, 4).map((_, i) => (
                            <Skeleton key={i} className="h-3 w-20" />
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-border/60">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-8 px-4 py-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data.length) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <div
            className={cn(
                variant === 'embedded' ? 'bg-card' : 'overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm',
                className,
            )}
        >
            <div className="max-h-[calc(100vh-20rem)] overflow-auto">
                <Table>
                    <TableHeader className={stickyHeader ? 'sticky top-0 z-10' : undefined}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-border/80 hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
