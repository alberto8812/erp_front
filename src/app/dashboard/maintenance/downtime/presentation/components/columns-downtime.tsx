"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Downtime, DowntimeStatus, DowntimeType } from "../../domain/entities/downtime.entity";
import { formatDateTime } from "@/lib/utils";

const STATUS_LABELS: Record<DowntimeStatus, string> = {
  active: "Activo",
  resolved: "Resuelto",
  cancelled: "Cancelado",
};

const STATUS_VARIANTS: Record<DowntimeStatus, "destructive" | "success" | "secondary"> = {
  active: "destructive",
  resolved: "success",
  cancelled: "secondary",
};

const TYPE_LABELS: Record<DowntimeType, string> = {
  planned: "Planificado",
  unplanned: "No Planificado",
  breakdown: "Avería",
  setup: "Configuración",
  changeover: "Cambio",
};

export const columnsDowntime: ColumnDef<Downtime>[] = [
  {
    accessorKey: "downtime_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.getValue("downtime_number")}</span>
    ),
  },
  {
    accessorKey: "asset_name",
    header: "Activo",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.asset_name || row.original.asset_code}</p>
        {row.original.asset_code && row.original.asset_name && (
          <p className="text-xs text-muted-foreground">{row.original.asset_code}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "downtime_type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("downtime_type") as DowntimeType;
      return <Badge variant="outline">{TYPE_LABELS[type] || type}</Badge>;
    },
  },
  {
    accessorKey: "start_datetime",
    header: "Inicio",
    cell: ({ row }) => {
      const date = row.getValue("start_datetime") as string;
      return <span className="text-sm">{formatDateTime(date)}</span>;
    },
  },
  {
    accessorKey: "duration_minutes",
    header: "Duración",
    cell: ({ row }) => {
      const minutes = row.getValue("duration_minutes") as number | null;
      if (!minutes) {
        return <span className="text-muted-foreground">En curso...</span>;
      }
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return (
        <span className="font-mono">
          {hours > 0 ? `${hours}h ` : ""}
          {mins}m
        </span>
      );
    },
  },
  {
    accessorKey: "failure_code",
    header: "Falla",
    cell: ({ row }) => {
      const code = row.getValue("failure_code") as string | null;
      return code ? (
        <Badge variant="secondary">{code}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as DowntimeStatus;
      return (
        <Badge variant={STATUS_VARIANTS[status]}>
          {STATUS_LABELS[status] || status}
        </Badge>
      );
    },
  },
];
