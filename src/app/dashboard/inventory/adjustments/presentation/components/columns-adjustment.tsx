"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Adjustment, AdjustmentStatus, AdjustmentType } from "../../domain/entities/adjustment.entity";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_OPTIONS: { label: string; value: AdjustmentStatus }[] = [
  { label: "Borrador", value: "draft" },
  { label: "Pendiente Aprobación", value: "pending_approval" },
  { label: "Aprobado", value: "approved" },
  { label: "Contabilizado", value: "posted" },
  { label: "Cancelado", value: "cancelled" },
];

const TYPE_LABELS: Record<AdjustmentType, string> = {
  quantity: "Cantidad",
  value: "Valor",
  both: "Cantidad y Valor",
};

export const columnsAdjustments: ColumnDef<Adjustment>[] = [
  {
    accessorKey: "adjustment_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.getValue("adjustment_number")}</span>
    ),
  },
  {
    accessorKey: "adjustment_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("adjustment_date") as string;
      return <span className="text-sm">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "adjustment_type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("adjustment_type") as AdjustmentType;
      return <Badge variant="outline">{TYPE_LABELS[type] || type}</Badge>;
    },
  },
  {
    accessorKey: "warehouse_name",
    header: "Almacén",
    cell: ({ row }) => {
      const name = row.getValue("warehouse_name") as string | null;
      return name ? (
        <span className="text-sm">{name}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "line_count",
    header: "Líneas",
    cell: ({ row }) => {
      const count = row.getValue("line_count") as number | null;
      return <span className="text-sm">{count ?? 0}</span>;
    },
  },
  {
    accessorKey: "total_quantity_adjustment",
    header: "Ajuste Cantidad",
    cell: ({ row }) => {
      const value = row.getValue("total_quantity_adjustment") as number;
      if (value === 0) return <span className="text-muted-foreground">0</span>;
      const isPositive = value > 0;
      return (
        <span className={`font-mono ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
          {isPositive ? "+" : ""}
          {value.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "total_cost_adjustment",
    header: "Ajuste Valor",
    cell: ({ row }) => {
      const value = row.getValue("total_cost_adjustment") as number;
      if (value === 0) return <span className="text-muted-foreground">$0</span>;
      const isPositive = value > 0;
      return (
        <span className={`font-mono ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
          {isPositive ? "+" : ""}
          {formatCurrency(value)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as AdjustmentStatus;
      const option = STATUS_OPTIONS.find((o) => o.value === status);
      const variants: Record<AdjustmentStatus, "success" | "secondary" | "destructive" | "outline" | "default"> = {
        draft: "secondary",
        pending_approval: "outline",
        approved: "default",
        posted: "success",
        cancelled: "destructive",
      };
      return (
        <Badge variant={variants[status] || "outline"}>
          {option?.label || status}
        </Badge>
      );
    },
  },
];
