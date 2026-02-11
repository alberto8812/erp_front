"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Bank } from "../../domain/entities/bank.entity";

export const columnsBanks: ColumnDef<Bank>[] = [
  {
    accessorKey: "bank_code",
    header: "Código",
    cell: ({ row }) => <span className="font-medium">{row.getValue("bank_code")}</span>,
  },
  {
    accessorKey: "bank_name",
    header: "Nombre",
  },
  {
    accessorKey: "swift_code",
    header: "SWIFT",
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
