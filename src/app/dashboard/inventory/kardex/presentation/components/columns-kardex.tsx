"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react";
import {
  KARDEX_MOVEMENT_TYPE_OPTIONS,
  KARDEX_STATUS_OPTIONS,
} from "@/app/dashboard/inventory/shared/types/inventory.types";
import type { Kardex } from "../../domain/entities/kardex.entity";

// Helper to determine if movement is entry (increases stock)
const isEntryMovement = (type: string): boolean => {
  const entryTypes = [
    "purchase_receipt",
    "production_receipt",
    "transfer_in",
    "return_from_customer",
    "adjustment_in",
    "initial_inventory",
    "found_inventory",
  ];
  return entryTypes.includes(type);
};

export const columnsKardex: ColumnDef<Kardex>[] = [
  {
    accessorKey: "movement_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("movement_date") as string;
      return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "movement_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("movement_number")}</span>
    ),
  },
  {
    accessorKey: "movement_type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("movement_type") as string;
      const option = KARDEX_MOVEMENT_TYPE_OPTIONS.find((o) => o.value === type);
      const isEntry = isEntryMovement(type);
      return (
        <div className="flex items-center gap-1.5">
          {isEntry ? (
            <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
          ) : type.includes("transfer") || type.includes("quality") ? (
            <RefreshCw className="h-4 w-4 text-blue-500" />
          ) : (
            <ArrowUpCircle className="h-4 w-4 text-rose-500" />
          )}
          <span className="text-xs">{option?.label || type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "product_sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.getValue("product_sku")}</span>
    ),
  },
  {
    accessorKey: "product_name",
    header: "Producto",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate text-sm">{row.getValue("product_name")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      const qty = row.getValue("quantity") as number;
      const type = row.original.movement_type;
      const isEntry = isEntryMovement(type);
      return (
        <span className={`font-mono font-medium ${isEntry ? "text-emerald-600" : "text-rose-600"}`}>
          {isEntry ? "+" : "-"}{qty.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "unit_cost",
    header: "Costo Unit.",
    cell: ({ row }) => {
      const cost = row.getValue("unit_cost") as number;
      return <span className="font-mono text-xs">${cost.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "running_quantity",
    header: "Saldo Cant.",
    cell: ({ row }) => {
      const qty = row.getValue("running_quantity") as number;
      return <span className="font-mono font-medium">{qty.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "running_unit_cost",
    header: "Costo Prom.",
    cell: ({ row }) => {
      const cost = row.getValue("running_unit_cost") as number;
      return <span className="font-mono text-xs">${cost.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "source_document_number",
    header: "Doc. Origen",
    cell: ({ row }) => {
      const doc = row.getValue("source_document_number") as string | null;
      return doc ? (
        <span className="font-mono text-xs">{doc}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const option = KARDEX_STATUS_OPTIONS.find((o) => o.value === status);
      const variants: Record<string, "success" | "secondary" | "destructive" | "outline" | "default"> = {
        draft: "secondary",
        confirmed: "outline",
        posted: "success",
        cancelled: "destructive",
      };
      return (
        <Badge variant={variants[status] || "outline"} className="text-xs">
          {option?.label || status}
        </Badge>
      );
    },
  },
];
