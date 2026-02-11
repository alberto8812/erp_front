"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Star, Check } from "lucide-react";
import type { PriceList } from "../../domain/entities/price-list.entity";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function getStatusInfo(priceList: PriceList): { label: string; color: string } {
  if (!priceList.is_active) {
    return { label: "Inactiva", color: "bg-muted text-muted-foreground" };
  }

  const now = new Date();
  const effectiveTo = priceList.effective_to ? new Date(priceList.effective_to) : null;

  if (effectiveTo && effectiveTo < now) {
    return { label: "Expirada", color: "bg-warning/15 text-warning" };
  }

  return { label: "Activa", color: "bg-success/15 text-success" };
}

function getCustomerTypeLabel(type: PriceList["customer_type"]): string {
  const labels: Record<string, string> = {
    all: "Todos",
    wholesale: "Mayorista",
    retail: "Minorista",
    vip: "VIP",
  };
  return labels[type || "all"] || type || "Todos";
}

export const columnsPriceLists: ColumnDef<PriceList>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium font-mono text-sm">
          {row.getValue("code")}
        </span>
        {row.original.is_default && (
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="truncate font-medium text-sm">
          {row.getValue("name")}
        </div>
        {row.original.description && (
          <div className="truncate text-xs text-muted-foreground">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "currency",
    header: "Moneda",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.getValue("currency")}
      </span>
    ),
  },
  {
    accessorKey: "customer_type",
    header: "Tipo Cliente",
    cell: ({ row }) => {
      const type = row.original.customer_type;
      return (
        <span className="text-sm">
          {getCustomerTypeLabel(type)}
        </span>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-center">
        {row.getValue("priority")}
      </span>
    ),
  },
  {
    accessorKey: "effective_from",
    header: "Vigencia",
    cell: ({ row }) => {
      const from = row.getValue("effective_from") as string;
      const to = row.original.effective_to;
      return (
        <div className="text-sm tabular-nums">
          <div>{formatDate(from)}</div>
          {to && (
            <div className="text-xs text-muted-foreground">
              hasta {formatDate(to)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "discount_percent",
    header: "Descuento",
    cell: ({ row }) => {
      const discount = row.getValue("discount_percent") as number | null;
      return discount ? (
        <span className="font-mono text-sm text-success">
          -{discount}%
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const { label, color } = getStatusInfo(row.original);
      return (
        <Badge variant="outline" className={`${color} border-0`}>
          {label}
        </Badge>
      );
    },
  },
];
