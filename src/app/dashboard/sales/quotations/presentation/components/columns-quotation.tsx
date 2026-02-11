"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  getQuotationStatusLabel,
  getQuotationStatusColor,
} from "../../../shared/types/sales.types";
import type { Quotation } from "../../domain/entities/quotation.entity";

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export const columnsQuotations: ColumnDef<Quotation>[] = [
  {
    accessorKey: "quotation_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-sm">
        {row.getValue("quotation_number")}
      </span>
    ),
  },
  {
    accessorKey: "quotation_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("quotation_date") as string;
      return (
        <span className="text-sm tabular-nums">
          {formatDate(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return customer ? (
        <div className="max-w-[200px]">
          <div className="truncate font-medium text-sm">
            {customer.comercial_name || customer.legal_name}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {customer.tax_id}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total_amount") as number;
      const currency = row.original.currency;
      return (
        <span className="font-mono text-sm font-medium tabular-nums">
          {formatCurrency(total, currency)}
        </span>
      );
    },
  },
  {
    accessorKey: "valid_until",
    header: "Válida Hasta",
    cell: ({ row }) => {
      const date = row.getValue("valid_until") as string | null;
      if (!date) return <span className="text-muted-foreground">—</span>;

      const validDate = new Date(date);
      const isExpired = validDate < new Date();
      return (
        <span className={`text-sm tabular-nums ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
          {formatDate(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as Quotation["status"];
      const label = getQuotationStatusLabel(status);
      const colorClass = getQuotationStatusColor(status);
      return (
        <Badge variant="outline" className={`${colorClass} border-0`}>
          {label}
        </Badge>
      );
    },
  },
];
