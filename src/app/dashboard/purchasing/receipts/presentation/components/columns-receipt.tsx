"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";
import {
  getReceiptStatusLabel,
  getReceiptStatusColor,
} from "../../../shared/types/purchasing.types";
import type { Receipt } from "../../domain/entities/receipt.entity";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export const columnsReceipts: ColumnDef<Receipt>[] = [
  {
    accessorKey: "receipt_number",
    header: "Recepción",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium font-mono text-sm">
          {row.getValue("receipt_number")}
        </span>
        {row.original.requires_inspection && (
          <span title="Requiere inspección">
            <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "purchase_order",
    header: "Orden de Compra",
    cell: ({ row }) => {
      const order = row.original.purchase_order;
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
    accessorKey: "receipt_date",
    header: "Fecha Recepción",
    cell: ({ row }) => {
      const date = row.getValue("receipt_date") as string;
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
    accessorKey: "warehouse",
    header: "Bodega",
    cell: ({ row }) => {
      const warehouse = row.original.warehouse;
      return warehouse ? (
        <span className="text-sm">
          {warehouse.name}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "delivery_note_number",
    header: "Remisión",
    cell: ({ row }) => {
      const note = row.getValue("delivery_note_number") as string | null;
      return note ? (
        <span className="font-mono text-xs">
          {note}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "tracking_number",
    header: "Tracking",
    cell: ({ row }) => {
      const tracking = row.getValue("tracking_number") as string | null;
      return tracking ? (
        <span className="font-mono text-xs">
          {tracking}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as Receipt["status"];
      const label = getReceiptStatusLabel(status);
      const colorClass = getReceiptStatusColor(status);
      return (
        <Badge variant="outline" className={`${colorClass} border-0`}>
          {label}
        </Badge>
      );
    },
  },
];
