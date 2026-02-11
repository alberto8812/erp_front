"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  pageCount?: number;
  rowCount?: number;
  isLoading?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  paginationState: PaginationState;
}

interface PaginationState {
  limit: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export function MainDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  rowCount,
  isLoading = false,
  onPaginationChange,
  paginationState,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pageCount || 0,
  });

  const handlePreviousPage = () => {
    if (onPaginationChange && paginationState?.hasPreviousPage) {
      onPaginationChange({
        limit: paginationState?.limit,
        startCursor: null,
        endCursor: paginationState?.startCursor,
      });
    }
  };

  const handleNextPage = () => {
    if (onPaginationChange && paginationState?.hasNextPage) {
      onPaginationChange({
        limit: paginationState?.limit,
        startCursor: paginationState?.endCursor,
        endCursor: null,
      });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange({
        limit: newPageSize,
        startCursor: null,
        endCursor: null,
      });
    }
  };

  const totalRows = rowCount || 0;
  const currentRows = table.getRowModel().rows.length;
  const hasRows = currentRows > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 h-10 bg-muted/95 text-xs font-medium uppercase tracking-wide backdrop-blur-sm"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasRows ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-48"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Inbox className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Sin resultados</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      No se encontraron registros
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className="flex shrink-0 items-center justify-between border-t bg-muted/20 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filas por pagina</span>
          <select
            value={paginationState?.limit || 10}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-7 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {isLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}

          <span className="text-xs text-muted-foreground tabular-nums">
            {hasRows ? `1–${currentRows}` : "0"} de {totalRows}
          </span>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handlePreviousPage}
              disabled={!paginationState?.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextPage}
              disabled={!paginationState?.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
