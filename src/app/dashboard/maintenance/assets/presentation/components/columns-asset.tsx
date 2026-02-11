"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Gauge, Wrench } from "lucide-react";
import type {
  MaintenanceAsset,
  AssetStatus,
  AssetCriticality,
} from "../../domain/entities/asset.entity";
import {
  getAssetStatusLabel,
  getAssetStatusColor,
  getCriticalityLabel,
  getCriticalityColor,
} from "../../domain/entities/asset.entity";

function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${getAssetStatusColor(status)}`}>
      {getAssetStatusLabel(status)}
    </Badge>
  );
}

function CriticalityBadge({ criticality }: { criticality: AssetCriticality }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${getCriticalityColor(criticality)}`}>
      {getCriticalityLabel(criticality)}
    </Badge>
  );
}

export const columnsAsset: ColumnDef<MaintenanceAsset>[] = [
  {
    accessorKey: "asset_code",
    header: "Código",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">{row.original.asset_code}</span>
    ),
  },
  {
    accessorKey: "asset_name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.asset_name}</span>
        {(row.original.manufacturer || row.original.model) && (
          <span className="text-xs text-muted-foreground">
            {[row.original.manufacturer, row.original.model].filter(Boolean).join(" - ")}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "area",
    header: "Ubicación",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.area || "—"}</span>
        {row.original.production_line && (
          <span className="text-xs text-muted-foreground">{row.original.production_line}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "criticality",
    header: "Criticidad",
    cell: ({ row }) => <CriticalityBadge criticality={row.original.criticality} />,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "has_meter",
    header: "Medidor",
    cell: ({ row }) => {
      if (!row.original.has_meter) {
        return <span className="text-muted-foreground/50">—</span>;
      }
      return (
        <div className="flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-sm tabular-nums">
            {row.original.current_meter_reading?.toLocaleString() || 0}
          </span>
          <span className="text-xs text-muted-foreground">{row.original.meter_unit}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "next_maintenance_date",
    header: "Próx. Mant.",
    cell: ({ row }) => {
      if (!row.original.next_maintenance_date) {
        return <span className="text-muted-foreground/50">—</span>;
      }
      const date = new Date(row.original.next_maintenance_date);
      const now = new Date();
      const isOverdue = date < now;
      const isUpcoming = date.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;

      return (
        <div className="flex items-center gap-1.5">
          <Wrench
            className={`h-3.5 w-3.5 ${
              isOverdue ? "text-destructive" : isUpcoming ? "text-warning" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-sm ${
              isOverdue ? "text-destructive font-medium" : isUpcoming ? "text-warning" : ""
            }`}
          >
            {date.toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
          </span>
        </div>
      );
    },
  },
];
