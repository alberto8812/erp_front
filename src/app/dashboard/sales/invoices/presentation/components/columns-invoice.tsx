"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { CustomerInvoice } from "../../domain/entities/invoice.entity";
import { getInvoiceStatusLabel, getInvoiceStatusColor } from "../../../shared/types/sales.types";

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export const columnsInvoice: ColumnDef<CustomerInvoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.original.invoice_number}
      </span>
    ),
  },
  {
    accessorKey: "invoice_date",
    header: "Fecha",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.invoice_date)}
      </span>
    ),
  },
  {
    accessorKey: "customer.legal_name",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <p className="font-medium text-sm truncate">
          {row.original.customer?.legal_name || row.original.customer?.comercial_name || "—"}
        </p>
        {row.original.customer?.tax_id && (
          <p className="text-xs text-muted-foreground font-mono">
            {row.original.customer.tax_id}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "due_date",
    header: "Vencimiento",
    cell: ({ row }) => {
      const dueDate = new Date(row.original.due_date);
      const today = new Date();
      const isOverdue = dueDate < today && row.original.status !== "paid";
      return (
        <span className={`text-sm ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
          {formatDate(row.original.due_date)}
        </span>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono tabular-nums text-sm font-medium">
        {formatCurrency(row.original.total_amount, row.original.currency)}
      </div>
    ),
  },
  {
    accessorKey: "balance_due",
    header: () => <div className="text-right">Saldo</div>,
    cell: ({ row }) => (
      <div className={`text-right font-mono tabular-nums text-sm ${row.original.balance_due > 0 ? "text-destructive font-medium" : "text-success"}`}>
        {formatCurrency(row.original.balance_due, row.original.currency)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInvoiceStatusColor(
          row.original.status
        )}`}
      >
        {getInvoiceStatusLabel(row.original.status)}
      </span>
    ),
  },
];
