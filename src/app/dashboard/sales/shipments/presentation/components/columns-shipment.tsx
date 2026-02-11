"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  getShipmentStatusLabel,
  getShipmentStatusColor,
} from "../../../shared/types/sales.types";
import type { Shipment } from "../../domain/entities/shipment.entity";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export const columnsShipments: ColumnDef<Shipment>[] = [
  {
    accessorKey: "shipment_number",
    header: "Despacho",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-sm">
        {row.getValue("shipment_number")}
      </span>
    ),
  },
  {
    accessorKey: "sales_order",
    header: "Orden de Venta",
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
    accessorKey: "shipment_date",
    header: "Fecha Despacho",
    cell: ({ row }) => {
      const date = row.getValue("shipment_date") as string;
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
    accessorKey: "expected_delivery_date",
    header: "Entrega Esperada",
    cell: ({ row }) => {
      const date = row.getValue("expected_delivery_date") as string | null;
      if (!date) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatDate(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as Shipment["status"];
      const label = getShipmentStatusLabel(status);
      const colorClass = getShipmentStatusColor(status);
      return (
        <Badge variant="outline" className={`${colorClass} border-0`}>
          {label}
        </Badge>
      );
    },
  },
];
