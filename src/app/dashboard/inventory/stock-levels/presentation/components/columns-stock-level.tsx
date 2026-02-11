"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StockLevel } from "../../domain/entities/stock-level.entity";

export const columnsStockLevels: ColumnDef<StockLevel>[] = [
  {
    accessorKey: "product_id",
    header: "Producto",
    cell: ({ row }) => {
      const productId = row.getValue("product_id") as string;
      return <span className="font-mono text-xs">{productId.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: "warehouse_id",
    header: "Almacén",
    cell: ({ row }) => {
      const warehouseId = row.getValue("warehouse_id") as string;
      return <span className="font-mono text-xs">{warehouseId.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: "quantity_on_hand",
    header: "En Existencia",
    cell: ({ row }) => {
      const qty = row.getValue("quantity_on_hand") as number;
      return <span className="font-mono font-medium">{qty.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "quantity_reserved",
    header: "Reservado",
    cell: ({ row }) => {
      const qty = row.getValue("quantity_reserved") as number;
      return qty > 0 ? (
        <span className="font-mono text-amber-600">{qty.toLocaleString()}</span>
      ) : (
        <span className="font-mono text-muted-foreground">0</span>
      );
    },
  },
  {
    accessorKey: "quantity_available",
    header: "Disponible",
    cell: ({ row }) => {
      const qty = row.getValue("quantity_available") as number;
      return (
        <Badge variant={qty > 0 ? "success" : "destructive"} className="font-mono">
          {qty.toLocaleString()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity_incoming",
    header: "Por Llegar",
    cell: ({ row }) => {
      const qty = row.getValue("quantity_incoming") as number;
      return qty > 0 ? (
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="font-mono">{qty.toLocaleString()}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "quantity_outgoing",
    header: "Por Salir",
    cell: ({ row }) => {
      const qty = row.getValue("quantity_outgoing") as number;
      return qty > 0 ? (
        <div className="flex items-center gap-1 text-rose-600">
          <TrendingDown className="h-3.5 w-3.5" />
          <span className="font-mono">{qty.toLocaleString()}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "total_value",
    header: "Valor Total",
    cell: ({ row }) => {
      const value = row.getValue("total_value") as number | null;
      return value !== null ? (
        <span className="font-mono">${value.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "last_movement_date",
    header: "Último Movimiento",
    cell: ({ row }) => {
      const date = row.getValue("last_movement_date") as string | null;
      if (!date) return <span className="text-muted-foreground">—</span>;
      return <span className="text-xs">{new Date(date).toLocaleDateString()}</span>;
    },
  },
];
