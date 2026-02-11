"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Warehouse } from "../../domain/entities/warehouse.entity";

export const columnsWarehouses: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="font-medium">{row.getValue("code")}</span>
        {row.original.is_default && (
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "city",
    header: "Ciudad",
    cell: ({ row }) => {
      const city = row.getValue("city") as string | null;
      return city || <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null;
      return phone || <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "allows_negative_stock",
    header: "Stock Negativo",
    cell: ({ row }) => {
      const allows = row.getValue("allows_negative_stock") as boolean;
      return (
        <Badge variant={allows ? "outline" : "secondary"}>
          {allows ? "Permitido" : "No permitido"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const active = row.getValue("is_active") as boolean;
      return (
        <Badge variant={active ? "success" : "destructive"}>
          {active ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
];
