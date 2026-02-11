"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import type { DocumentLineColumn } from "./types";

interface DocumentLinesTableProps<T extends object> {
  lines: T[];
  columns: DocumentLineColumn<T>[];
  title?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function getNestedValue(obj: object, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj as unknown);
}

export function DocumentLinesTable<T extends object>({
  lines,
  columns,
  title = "Lineas de Detalle",
  emptyMessage = "Sin lineas",
  emptyDescription = "Este documento no tiene lineas de detalle.",
}: DocumentLinesTableProps<T>) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {lines.length} {lines.length === 1 ? "linea" : "lineas"} en total
        </p>
      </div>

      <Card className="overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={`text-xs font-medium uppercase tracking-wide ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="rounded-full bg-muted p-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">{emptyMessage}</p>
                      <p className="text-xs text-muted-foreground">
                        {emptyDescription}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                lines.map((line, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => {
                      const value = getNestedValue(
                        line,
                        String(column.key)
                      );

                      return (
                        <TableCell
                          key={String(column.key)}
                          className={`text-sm ${
                            column.align === "center"
                              ? "text-center"
                              : column.align === "right"
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {column.render ? (
                            column.render(value, line)
                          ) : typeof value === "number" ? (
                            <span className="font-mono tabular-nums">
                              {formatNumber(value)}
                            </span>
                          ) : (
                            <span>{String(value ?? "—")}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
