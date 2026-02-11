"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_TYPE_OPTIONS } from "@/app/dashboard/inventory/shared/types/inventory.types";
import type { Product } from "../../domain/entities/product.entity";

export const columnsProducts: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <span className="font-medium font-mono">{row.getValue("sku")}</span>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "product_type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("product_type") as string;
      const option = PRODUCT_TYPE_OPTIONS.find((o) => o.value === type);
      const variants: Record<string, "default" | "secondary" | "outline"> = {
        stockable: "default",
        service: "secondary",
        consumable: "outline",
        kit: "outline",
      };
      return (
        <Badge variant={variants[type] || "outline"}>
          {option?.label || type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "barcode",
    header: "Código de Barras",
    cell: ({ row }) => {
      const barcode = row.getValue("barcode") as string | null;
      return barcode ? (
        <span className="font-mono text-xs">{barcode}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "base_price",
    header: "Precio Base",
    cell: ({ row }) => {
      const price = row.getValue("base_price") as number | null;
      return price !== null ? (
        <span className="font-mono">${price.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "average_cost",
    header: "Costo Promedio",
    cell: ({ row }) => {
      const cost = row.getValue("average_cost") as number | null;
      return cost !== null ? (
        <span className="font-mono text-muted-foreground">${cost.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "is_lot_tracked",
    header: "Lotes",
    cell: ({ row }) => {
      const tracked = row.getValue("is_lot_tracked") as boolean;
      return (
        <Badge variant={tracked ? "outline" : "secondary"} className="text-xs">
          {tracked ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "success" : "destructive"}>
          {status === "active" ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
];
