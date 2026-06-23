import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/common/EmptyState';

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
}

export function DataTable<T>({
    columns,
    data,
    isLoading,
    emptyTitle = 'No results found',
    emptyDescription,
}: DataTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (!data.length) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
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
    );
}
