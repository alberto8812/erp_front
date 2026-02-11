"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Currency } from "../../domain/entities/currency.entity";

export const columnsCurrencies: ColumnDef<Currency>[] = [
  {
    accessorKey: "iso_code",
    header: "Código ISO",
    cell: ({ row }) => <span className="font-medium">{row.getValue("iso_code")}</span>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "symbol",
    header: "Símbolo",
  },
  {
    accessorKey: "decimal_places",
    header: "Decimales",
    cell: ({ row }) => <span className="tabular-nums">{row.getValue("decimal_places")}</span>,
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
