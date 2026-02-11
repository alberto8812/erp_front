"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ImportPreviewTableProps {
  rows: Record<string, unknown>[];
  maxDisplay?: number;
}

export function ImportPreviewTable({
  rows,
  maxDisplay = 10,
}: ImportPreviewTableProps) {
  if (rows.length === 0) return null;

  const displayRows = rows.slice(0, maxDisplay);
  const firstRow = rows[0];
  const keys = Object.keys(firstRow);

  const flattenRow = (row: Record<string, unknown>): Record<string, string> => {
    const flat: Record<string, string> = {};
    for (const key of keys) {
      const val = row[key];
      if (val && typeof val === "object") {
        const nested = val as Record<string, unknown>;
        for (const nk of Object.keys(nested)) {
          if (nested[nk] !== null && nested[nk] !== undefined) {
            flat[`${key}.${nk}`] = String(nested[nk]);
          }
        }
      } else if (val !== null && val !== undefined) {
        flat[key] = String(val);
      }
    }
    return flat;
  };

  const flatRows = displayRows.map(flattenRow);
  const allKeys = flatRows.length > 0 ? Object.keys(flatRows[0]) : [];
  const visibleKeys = allKeys.slice(0, 6);

  return (
    <div className="max-h-56 overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 text-[11px] font-medium">#</TableHead>
            {visibleKeys.map((key) => (
              <TableHead key={key} className="text-[11px] font-medium">
                {key}
              </TableHead>
            ))}
            {allKeys.length > 6 && (
              <TableHead className="text-[11px] text-muted-foreground">
                +{allKeys.length - 6}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {flatRows.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono text-[11px] text-muted-foreground">
                {i + 1}
              </TableCell>
              {visibleKeys.map((key) => (
                <TableCell key={key} className="text-xs max-w-32 truncate">
                  {row[key] || <span className="text-muted-foreground/40">—</span>}
                </TableCell>
              ))}
              {allKeys.length > 6 && (
                <TableCell className="text-[11px] text-muted-foreground">...</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length > maxDisplay && (
        <p className="border-t bg-muted/20 py-2 text-center text-[11px] text-muted-foreground">
          {maxDisplay} de {rows.length} filas
        </p>
      )}
    </div>
  );
}
