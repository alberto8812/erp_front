"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Country } from "../../domain/entities/country.entity";

export const columnsCountries: ColumnDef<Country>[] = [
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
    accessorKey: "phone_code",
    header: "Código Tel.",
  },
  {
    accessorKey: "currency_code",
    header: "Moneda",
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
