"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { COUNT_STATUS_OPTIONS } from "@/app/dashboard/inventory/shared/types/inventory.types";
import type { InventoryCount } from "../../domain/entities/inventory-count.entity";

export const columnsInventoryCounts: ColumnDef<InventoryCount>[] = [
  {
    accessorKey: "count_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.getValue("count_number")}</span>
    ),
  },
  {
    accessorKey: "count_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("count_date") as string;
      return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "count_type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("count_type") as string;
      const labels: Record<string, string> = {
        full: "Completo",
        cycle: "Cíclico",
        spot: "Puntual",
      };
      return (
        <Badge variant="outline">
          {labels[type] || type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_items",
    header: "Progreso",
    cell: ({ row }) => {
      const total = row.original.total_items;
      const counted = row.original.counted_items;
      const progress = total > 0 ? (counted / total) * 100 : 0;
      return (
        <div className="w-32 space-y-1">
          <Progress value={progress} className="h-2" />
          <span className="text-xs text-muted-foreground">
            {counted} / {total}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "variance_items",
    header: "Variaciones",
    cell: ({ row }) => {
      const variance = row.getValue("variance_items") as number;
      return variance > 0 ? (
        <Badge variant="destructive">{variance}</Badge>
      ) : (
        <span className="text-muted-foreground">0</span>
      );
    },
  },
  {
    accessorKey: "total_variance_value",
    header: "Valor Variación",
    cell: ({ row }) => {
      const value = row.getValue("total_variance_value") as number | null;
      if (value === null) return <span className="text-muted-foreground">—</span>;
      const isNegative = value < 0;
      return (
        <span className={`font-mono ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
          {isNegative ? "-" : "+"}${Math.abs(value).toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const option = COUNT_STATUS_OPTIONS.find((o) => o.value === status);
      const variants: Record<string, "success" | "secondary" | "destructive" | "outline" | "default"> = {
        planned: "secondary",
        in_progress: "default",
        pending_review: "outline",
        approved: "success",
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
  {
    accessorKey: "assigned_to",
    header: "Asignado a",
    cell: ({ row }) => {
      const assigned = row.getValue("assigned_to") as string | null;
      return assigned ? (
        <span className="text-sm">{assigned}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];
