"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, PauseCircle } from "lucide-react";
import type { VendorInvoice } from "../../domain/entities/vendor-invoice.entity";
import {
  getVendorInvoiceStatusLabel,
  getVendorInvoiceStatusColor,
  getInvoiceMatchStatusLabel,
  getInvoiceMatchStatusColor,
} from "../../../shared/types/purchasing.types";

// Format currency
function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export const columnsVendorInvoices: ColumnDef<VendorInvoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Número",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("invoice_number")}</span>
        {row.original.vendor_invoice_ref && (
          <span className="text-xs text-muted-foreground">
            Ref: {row.original.vendor_invoice_ref}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "vendor",
    header: "Proveedor",
    cell: ({ row }) => {
      const vendor = row.original.vendor;
      return vendor ? (
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[200px]">
            {vendor.comercial_name || vendor.legal_name}
          </span>
          <span className="text-xs text-muted-foreground">{vendor.tax_id}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "invoice_date",
    header: "Fecha Factura",
    cell: ({ row }) => formatDate(row.getValue("invoice_date")),
  },
  {
    accessorKey: "due_date",
    header: "Vencimiento",
    cell: ({ row }) => {
      const dueDate = row.getValue("due_date") as string;
      const daysOverdue = row.original.days_overdue;
      const isOverdue = daysOverdue && daysOverdue > 0;
      const isPaid = row.original.status === "paid";

      return (
        <div className="flex items-center gap-1.5">
          <span className={cn(isOverdue && !isPaid && "text-destructive font-medium")}>
            {formatDate(dueDate)}
          </span>
          {isOverdue && !isPaid && (
            <Badge variant="destructive" className="text-[10px] px-1 py-0">
              {daysOverdue}d
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.getValue("total_amount"), row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "balance_due",
    header: "Saldo",
    cell: ({ row }) => {
      const balance = row.getValue("balance_due") as number;
      const isPaid = balance === 0;
      return (
        <span
          className={cn(
            "font-medium tabular-nums",
            isPaid ? "text-success" : "text-foreground"
          )}
        >
          {formatCurrency(balance, row.original.currency)}
        </span>
      );
    },
  },
  {
    accessorKey: "match_status",
    header: "Conciliación",
    cell: ({ row }) => {
      const status = row.original.match_status;
      return (
        <Badge className={cn("font-normal", getInvoiceMatchStatusColor(status))}>
          {getInvoiceMatchStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      const paymentHold = row.original.payment_hold;

      const icon =
        status === "paid" ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : status === "hold" || paymentHold ? (
          <PauseCircle className="h-3.5 w-3.5" />
        ) : status === "cancelled" ? (
          <AlertCircle className="h-3.5 w-3.5" />
        ) : (
          <Clock className="h-3.5 w-3.5" />
        );

      return (
        <div className="flex items-center gap-1.5">
          <Badge className={cn("font-normal gap-1", getVendorInvoiceStatusColor(status))}>
            {icon}
            {getVendorInvoiceStatusLabel(status)}
          </Badge>
          {paymentHold && status !== "hold" && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 border-warning text-warning">
              HOLD
            </Badge>
          )}
        </div>
      );
    },
  },
];
