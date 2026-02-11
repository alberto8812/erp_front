"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { LOT_STATUS_OPTIONS } from "@/app/dashboard/inventory/shared/types/inventory.types";
import type { Lot } from "../../domain/entities/lot.entity";

export const columnsLots: ColumnDef<Lot>[] = [
  {
    accessorKey: "lot_number",
    header: "Número de Lote",
    cell: ({ row }) => <span className="font-medium font-mono">{row.getValue("lot_number")}</span>,
  },
  {
    accessorKey: "product_id",
    header: "Producto",
    cell: ({ row }) => {
      const productId = row.getValue("product_id") as string;
      return <span className="text-xs text-muted-foreground">{productId.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: "current_quantity",
    header: "Cantidad Actual",
    cell: ({ row }) => {
      const qty = row.getValue("current_quantity") as number;
      return <span className="font-mono">{qty.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "expiration_date",
    header: "Vencimiento",
    cell: ({ row }) => {
      const date = row.getValue("expiration_date") as string | null;
      if (!date) return <span className="text-muted-foreground">—</span>;

      const expDate = new Date(date);
      const today = new Date();
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isExpiringSoon = diffDays <= 30 && diffDays > 0;
      const isExpired = diffDays <= 0;

      return (
        <div className="flex items-center gap-1">
          {(isExpiringSoon || isExpired) && (
            <AlertTriangle className={`h-3.5 w-3.5 ${isExpired ? "text-destructive" : "text-amber-500"}`} />
          )}
          <span className={isExpired ? "text-destructive" : isExpiringSoon ? "text-amber-500" : ""}>
            {expDate.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "unit_cost",
    header: "Costo Unitario",
    cell: ({ row }) => {
      const cost = row.getValue("unit_cost") as number | null;
      return cost !== null ? (
        <span className="font-mono">${cost.toLocaleString()}</span>
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
      const option = LOT_STATUS_OPTIONS.find((o) => o.value === status);
      const variants: Record<string, "success" | "secondary" | "destructive" | "outline"> = {
        available: "success",
        reserved: "secondary",
        quarantine: "outline",
        expired: "destructive",
        consumed: "secondary",
        blocked: "destructive",
      };
      return (
        <Badge variant={variants[status] || "outline"}>
          {option?.label || status}
        </Badge>
      );
    },
  },
];
