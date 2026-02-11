"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RowError {
  row: number;
  column: string;
  value: unknown;
  error: string;
}

interface ImportErrorTableProps {
  errors: RowError[];
}

export function ImportErrorTable({ errors }: ImportErrorTableProps) {
  if (errors.length === 0) return null;

  return (
    <div className="max-h-56 overflow-auto rounded-md border border-destructive/20">
      <Table>
        <TableHeader>
          <TableRow className="bg-destructive/5 hover:bg-destructive/5">
            <TableHead className="w-14 text-[11px] font-medium">Fila</TableHead>
            <TableHead className="text-[11px] font-medium">Columna</TableHead>
            <TableHead className="text-[11px] font-medium">Valor</TableHead>
            <TableHead className="text-[11px] font-medium">Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.map((err, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono text-[11px]">{err.row}</TableCell>
              <TableCell className="text-xs font-medium">{err.column}</TableCell>
              <TableCell className="text-xs text-muted-foreground max-w-28 truncate">
                {err.value !== null && err.value !== undefined
                  ? String(err.value)
                  : <span className="italic">(vacio)</span>}
              </TableCell>
              <TableCell className="text-xs text-destructive">{err.error}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
