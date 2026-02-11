"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  getPurchaseOrderStatusLabel,
  getPurchaseOrderStatusColor,
} from "../../../shared/types/purchasing.types";
import type { PurchaseOrder } from "../../domain/entities/purchase-order.entity";

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

export const columnsPurchaseOrders: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "order_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-sm">
        {row.getValue("order_number")}
      </span>
    ),
  },
  {
    accessorKey: "order_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("order_date") as string;
      return (
        <span className="text-sm tabular-nums">
          {formatDate(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "vendor",
    header: "Proveedor",
    cell: ({ row }) => {
      const vendor = row.original.vendor;
      return vendor ? (
        <div className="max-w-[200px]">
          <div className="truncate font-medium text-sm">
            {vendor.comercial_name || vendor.legal_name}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {vendor.tax_id}
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
    accessorKey: "currency",
    header: "Moneda",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.getValue("currency")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as PurchaseOrder["status"];
      const label = getPurchaseOrderStatusLabel(status);
      const colorClass = getPurchaseOrderStatusColor(status);
      return (
        <Badge variant="outline" className={`${colorClass} border-0`}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vendor_reference",
    header: "Ref. Proveedor",
    cell: ({ row }) => {
      const ref = row.getValue("vendor_reference") as string | null;
      return ref ? (
        <span className="font-mono text-xs">{ref}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "expected_date",
    header: "Fecha Esperada",
    cell: ({ row }) => {
      const date = row.getValue("expected_date") as string | null;
      return date ? (
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatDate(date)}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];
