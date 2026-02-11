"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { BankAccount } from "../../domain/entities/bank-account.entity";

export const columnsBankAccounts: ColumnDef<BankAccount>[] = [
  {
    accessorKey: "account_number",
    header: "Número de Cuenta",
    cell: ({ row }) => <span className="font-medium">{row.getValue("account_number")}</span>,
  },
  {
    accessorKey: "account_name",
    header: "Nombre",
  },
  {
    accessorKey: "account_type",
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
