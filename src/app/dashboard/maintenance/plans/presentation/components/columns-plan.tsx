"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Gauge,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { MaintenancePlan } from "../../domain/entities/maintenance-plan.entity";
import {
  getFrequencyTypeLabel,
  getFrequencyTypeColor,
  getPriorityLabel,
  getPriorityColor,
  getPlanStatusColor,
  formatFrequency,
  formatDuration,
} from "../../domain/entities/maintenance-plan.entity";

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
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

function formatCurrency(amount: number | undefined): string {
  if (amount === undefined || amount === null) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDaysUntilDue(dueDate: string | undefined): number | null {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const FrequencyTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "time_based":
      return <Clock className="h-3.5 w-3.5" />;
    case "meter_based":
      return <Gauge className="h-3.5 w-3.5" />;
    case "calendar_based":
      return <Calendar className="h-3.5 w-3.5" />;
    case "hybrid":
      return <Zap className="h-3.5 w-3.5" />;
    default:
      return <Clock className="h-3.5 w-3.5" />;
  }
};

export const columnsMaintenancePlans: ColumnDef<MaintenancePlan>[] = [
  {
    accessorKey: "plan_code",
    header: "Código",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium font-mono text-sm">
          {row.getValue("plan_code")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "plan_name",
    header: "Nombre del Plan",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="font-medium truncate">{row.getValue("plan_name")}</span>
        {row.original.description && (
          <span className="text-xs text-muted-foreground truncate">
            {row.original.description}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "asset",
    header: "Activo",
    cell: ({ row }) => {
      const asset = row.original.asset;
      return asset ? (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{asset.asset_name}</span>
          <span className="text-xs text-muted-foreground font-mono">
            {asset.asset_code}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "frequency_type",
    header: "Tipo Frecuencia",
    cell: ({ row }) => {
      const type = row.original.frequency_type;
      return (
        <Badge className={cn("font-normal gap-1", getFrequencyTypeColor(type))}>
          <FrequencyTypeIcon type={type} />
          {getFrequencyTypeLabel(type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "frequency",
    header: "Frecuencia",
    cell: ({ row }) => (
      <span className="text-sm">{formatFrequency(row.original)}</span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => {
      const priority = row.original.priority;
      return (
        <Badge className={cn("font-normal", getPriorityColor(priority))}>
          {getPriorityLabel(priority)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "next_due_date",
    header: "Próximo Vencimiento",
    cell: ({ row }) => {
      const dueDate = row.original.next_due_date;
      const daysUntil = getDaysUntilDue(dueDate);
      const isOverdue = daysUntil !== null && daysUntil < 0;
      const isUpcoming = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;

      return (
        <div className="flex items-center gap-1.5">
          {isOverdue && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
          <span
            className={cn(
              "text-sm",
              isOverdue && "text-destructive font-medium",
              isUpcoming && "text-warning font-medium"
            )}
          >
            {formatDate(dueDate)}
          </span>
          {daysUntil !== null && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1 py-0",
                isOverdue && "border-destructive text-destructive",
                isUpcoming && !isOverdue && "border-warning text-warning"
              )}
            >
              {isOverdue ? `${Math.abs(daysUntil)}d vencido` : `${daysUntil}d`}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "estimated_duration",
    header: "Duración Est.",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        {formatDuration(
          row.original.estimated_duration_hours,
          row.original.estimated_duration_minutes
        )}
      </span>
    ),
  },
  {
    accessorKey: "estimated_total_cost",
    header: "Costo Est.",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        {formatCurrency(row.original.estimated_total_cost)}
      </span>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <div className="flex items-center gap-1.5">
          <Badge className={cn("font-normal gap-1", getPlanStatusColor(isActive))}>
            {isActive ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {isActive ? "Activo" : "Inactivo"}
          </Badge>
          {row.original.auto_generate_wo && (
            <Badge
              variant="outline"
              className="text-[10px] px-1 py-0 border-primary/30 text-primary"
            >
              Auto-OT
            </Badge>
          )}
        </div>
      );
    },
  },
];
