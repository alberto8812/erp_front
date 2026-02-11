"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { CustomerCreditNote } from "../../domain/entities/credit-note.entity";
import { getCreditNoteStatusLabel, getCreditNoteStatusColor, getCreditNoteTypeLabel } from "../../../shared/types/sales.types";

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

export const columnsCreditNote: ColumnDef<CustomerCreditNote>[] = [
  {
    accessorKey: "credit_note_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.original.credit_note_number}
      </span>
    ),
  },
  {
    accessorKey: "credit_note_date",
    header: "Fecha",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.credit_note_date)}
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
    accessorKey: "credit_note_type",
    header: "Tipo",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {getCreditNoteTypeLabel(row.original.credit_note_type)}
      </span>
    ),
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
    accessorKey: "balance_remaining",
    header: () => <div className="text-right">Disponible</div>,
    cell: ({ row }) => (
      <div className={`text-right font-mono tabular-nums text-sm ${row.original.balance_remaining > 0 ? "text-success font-medium" : "text-muted-foreground"}`}>
        {formatCurrency(row.original.balance_remaining, row.original.currency)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCreditNoteStatusColor(
          row.original.status
        )}`}
      >
        {getCreditNoteStatusLabel(row.original.status)}
      </span>
    ),
  },
];
