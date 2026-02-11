"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  getSalesOrderStatusLabel,
  getSalesOrderStatusColor,
} from "../../../shared/types/sales.types";
import type { SalesOrder } from "../../domain/entities/sales-order.entity";

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

export const columnsSalesOrders: ColumnDef<SalesOrder>[] = [
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
      const status = row.getValue("status") as SalesOrder["status"];
      const label = getSalesOrderStatusLabel(status);
      const colorClass = getSalesOrderStatusColor(status);
      return (
        <Badge variant="outline" className={`${colorClass} border-0`}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "customer_po",
    header: "OC Cliente",
    cell: ({ row }) => {
      const po = row.getValue("customer_po") as string | null;
      return po ? (
        <span className="font-mono text-xs">{po}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "expected_ship_date",
    header: "Fecha Envío",
    cell: ({ row }) => {
      const date = row.getValue("expected_ship_date") as string | null;
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
