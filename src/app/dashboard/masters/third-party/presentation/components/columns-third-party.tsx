"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ThirdParty } from "../../domain/entities/third-party.entity";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const typeLabels: Record<string, string> = {
  customer: "Cliente",
  supplier: "Proveedor",
  both: "Ambos",
  salesperson: "Vendedor",
  employee: "Empleado",
  contractor: "Contratista",
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  suspended: "Suspendido",
  blocked: "Bloqueado",
};

export const columnsThirdParty: ColumnDef<ThirdParty>[] = [
  {
    accessorKey: "tax_id",
    header: "NIT",
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("tax_id")}</span>
    ),
  },
  {
    accessorKey: "legal_name",
    header: "Razon Social",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("legal_name")}</span>
    ),
  },
  {
    accessorKey: "comercial_name",
    header: "Nombre Comercial",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type: string = row.getValue("type");
      return <Badge variant="outline">{typeLabels[type] ?? type}</Badge>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "credit_limit",
    header: () => <span className="block text-right">Limite de credito</span>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("credit_limit"));
      return (
        <div className="text-right tabular-nums">
          {isNaN(amount) ? "-" : currencyFmt.format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: () => <span className="block text-right">Balance</span>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      return (
        <div className="text-right tabular-nums">
          {isNaN(amount) ? "-" : currencyFmt.format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return (
        <Badge
          variant={
            status === "active"
              ? "success"
              : status === "inactive" || status === "suspended"
                ? "warning"
                : status === "blocked"
                  ? "destructive"
                  : "outline"
          }
        >
          {statusLabels[status] ?? status}
        </Badge>
      );
    },
  },
];
