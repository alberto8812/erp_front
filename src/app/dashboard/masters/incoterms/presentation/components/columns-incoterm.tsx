"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Incoterm } from "../../domain/entities/incoterm.entity";

export const columnsIncoterms: ColumnDef<Incoterm>[] = [
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
    accessorKey: "version",
    header: "Versión",
  },
  {
    accessorKey: "applies_to",
    header: "Aplica a",
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
