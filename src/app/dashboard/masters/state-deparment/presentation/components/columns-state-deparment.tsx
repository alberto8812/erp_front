"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { StateDeparment } from "../../domain/entities/state-deparment.entity";

export const columnsStateDeparments: ColumnDef<StateDeparment>[] = [
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
    accessorKey: "dane_code",
    header: "Código DANE",
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
