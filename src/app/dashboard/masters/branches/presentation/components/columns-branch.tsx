"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Branch } from "../../domain/entities/branch.entity";

export const columnsBranches: ColumnDef<Branch>[] = [
  {
    accessorKey: "branch_code",
    header: "Código",
    cell: ({ row }) => <span className="font-medium">{row.getValue("branch_code")}</span>,
  },
  {
    accessorKey: "branch_name",
    header: "Nombre",
  },
  {
    accessorKey: "branch_type",
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
