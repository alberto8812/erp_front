"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ShippingMethod } from "../../domain/entities/shipping-method.entity";

export const columnsShippingMethods: ColumnDef<ShippingMethod>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => <span className="font-medium">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "estimated_days_min",
    header: "Días Mín.",
    cell: ({ row }) => <span className="tabular-nums">{row.getValue("estimated_days_min")}</span>,
  },
  {
    accessorKey: "estimated_days_max",
    header: "Días Máx.",
    cell: ({ row }) => <span className="tabular-nums">{row.getValue("estimated_days_max")}</span>,
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
