"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Carrier } from "../../domain/entities/carrier.entity";

export const columnsCarriers: ColumnDef<Carrier>[] = [
  {
    accessorKey: "carrier_code",
    header: "Código",
    cell: ({ row }) => <span className="font-medium">{row.getValue("carrier_code")}</span>,
  },
  {
    accessorKey: "carrier_name",
    header: "Nombre",
  },
  {
    accessorKey: "contact_email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("contact_email")}</span>,
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
