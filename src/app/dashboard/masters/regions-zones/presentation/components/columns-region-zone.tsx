"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { RegionZone } from "../../domain/entities/region-zone.entity";

export const columnsRegionsZones: ColumnDef<RegionZone>[] = [
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
    accessorKey: "zone_type",
    header: "Tipo",
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
