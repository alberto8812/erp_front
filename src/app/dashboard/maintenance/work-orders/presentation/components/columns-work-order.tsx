"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Wrench } from "lucide-react";
import type {
  MaintenanceWorkOrder,
  WorkOrderType,
  WorkOrderStatus,
  MaintenancePriority,
} from "../../domain/entities/work-order.entity";
import {
  getWorkOrderTypeLabel,
  getWorkOrderTypeColor,
  getWorkOrderStatusLabel,
  getWorkOrderStatusColor,
  getPriorityLabel,
  getPriorityColor,
} from "../../domain/entities/work-order.entity";

function TypeBadge({ type }: { type: WorkOrderType }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${getWorkOrderTypeColor(type)}`}>
      {getWorkOrderTypeLabel(type)}
    </Badge>
  );
}

function StatusBadge({ status }: { status: WorkOrderStatus }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${getWorkOrderStatusColor(status)}`}>
      {getWorkOrderStatusLabel(status)}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: MaintenancePriority }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${getPriorityColor(priority)}`}>
      {getPriorityLabel(priority)}
    </Badge>
  );
}

export const columnsWorkOrder: ColumnDef<MaintenanceWorkOrder>[] = [
  {
    accessorKey: "wo_number",
    header: "# OT",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">{row.original.wo_number}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="font-medium text-sm truncate">{row.original.title}</span>
        {row.original.asset && (
          <span className="text-xs text-muted-foreground truncate">
            <Wrench className="inline h-3 w-3 mr-1" />
            {row.original.asset.asset_name}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "wo_type",
    header: "Tipo",
    cell: ({ row }) => <TypeBadge type={row.original.wo_type} />,
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "assigned_user",
    header: "Asignado",
    cell: ({ row }) => {
      if (!row.original.assigned_user) {
        return <span className="text-muted-foreground/50">Sin asignar</span>;
      }
      return (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.original.assigned_user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "scheduled_start_date",
    header: "Programada",
    cell: ({ row }) => {
      const startDate = row.original.scheduled_start_date;
      if (!startDate) {
        return <span className="text-muted-foreground/50">—</span>;
      }
      const date = new Date(startDate);
      const now = new Date();
      const isOverdue = date < now && !["completed", "closed", "cancelled"].includes(row.original.status);

      return (
        <div className="flex items-center gap-1.5">
          <Calendar
            className={`h-3.5 w-3.5 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
          />
          <span className={`text-sm ${isOverdue ? "text-destructive font-medium" : ""}`}>
            {date.toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
          </span>
          {row.original.scheduled_start_time && (
            <span className="text-xs text-muted-foreground">
              {row.original.scheduled_start_time}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "estimated_total_cost",
    header: "Costo Est.",
    cell: ({ row }) => {
      if (!row.original.estimated_total_cost) {
        return <span className="text-muted-foreground/50">—</span>;
      }
      return (
        <span className="font-mono text-sm tabular-nums">
          ${row.original.estimated_total_cost.toLocaleString("es-CO")}
        </span>
      );
    },
  },
  {
    accessorKey: "actual_duration_hours",
    header: "Duración",
    cell: ({ row }) => {
      if (!row.original.actual_duration_hours) {
        return <span className="text-muted-foreground/50">—</span>;
      }
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-sm tabular-nums">
            {row.original.actual_duration_hours.toFixed(1)}h
          </span>
        </div>
      );
    },
  },
];
