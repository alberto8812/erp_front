"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LOCATION_TYPE_OPTIONS } from "@/app/dashboard/inventory/shared/types/inventory.types";
import type { WarehouseLocation } from "../../domain/entities/warehouse-location.entity";

export const columnsWarehouseLocations: ColumnDef<WarehouseLocation>[] = [
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
    accessorKey: "location_type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("location_type") as string;
      const option = LOCATION_TYPE_OPTIONS.find((o) => o.value === type);
      return (
        <Badge variant="outline">
          {option?.label || type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "full_path",
    header: "Ruta Completa",
    cell: ({ row }) => {
      const path = row.getValue("full_path") as string | null;
      return path ? (
        <span className="text-xs font-mono text-muted-foreground">{path}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "picking_sequence",
    header: "Secuencia",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("picking_sequence")}</span>
    ),
  },
  {
    accessorKey: "is_pickable",
    header: "Pickable",
    cell: ({ row }) => {
      const pickable = row.getValue("is_pickable") as boolean;
      return (
        <Badge variant={pickable ? "success" : "secondary"}>
          {pickable ? "Sí" : "No"}
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
