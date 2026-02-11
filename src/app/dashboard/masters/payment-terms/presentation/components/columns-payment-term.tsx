"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { PaymentTerm } from "../../domain/entities/payment-term.entity";

export const columnsPaymentTerms: ColumnDef<PaymentTerm>[] = [
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
    accessorKey: "days",
    header: "Días",
  },
  {
    accessorKey: "is_immediate",
    header: "Inmediato",
    cell: ({ row }) => {
      const val = row.getValue("is_immediate") as boolean;
      return <Badge variant={val ? "success" : "outline"}>{val ? "Sí" : "No"}</Badge>;
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
