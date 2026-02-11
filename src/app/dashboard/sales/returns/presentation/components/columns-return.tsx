"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  getReturnStatusLabel,
  getReturnStatusColor,
} from "../../../shared/types/sales.types";
import type { SalesReturn, ReturnReasonCode } from "../../domain/entities/return.entity";

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

function getReasonLabel(reason: ReturnReasonCode): string {
  const labels: Record<ReturnReasonCode, string> = {
    defective: "Defectuoso",
    wrong_item: "Artículo Incorrecto",
    damaged: "Dañado",
    not_as_described: "No Corresponde",
    customer_changed_mind: "Cambio de Opinión",
    quality_issue: "Problema de Calidad",
    other: "Otro",
  };
  return labels[reason] || reason;
}

export const columnsReturns: ColumnDef<SalesReturn>[] = [
  {
    accessorKey: "return_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-sm">
        {row.getValue("return_number")}
      </span>
    ),
  },
  {
    accessorKey: "return_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("return_date") as string;
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
    accessorKey: "sales_order",
    header: "Orden Original",
    cell: ({ row }) => {
      const order = row.original.sales_order;
      return order ? (
        <span className="font-mono text-sm text-muted-foreground">
          {order.order_number}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "reason_code",
    header: "Motivo",
    cell: ({ row }) => {
      const reason = row.getValue("reason_code") as ReturnReasonCode;
      return (
        <span className="text-sm">
          {getReasonLabel(reason)}
        </span>
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
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as SalesReturn["status"];
      const label = getReturnStatusLabel(status);
      const colorClass = getReturnStatusColor(status);
      return (
        <Badge variant="outline" className={`${colorClass} border-0`}>
          {label}
        </Badge>
      );
    },
  },
];
