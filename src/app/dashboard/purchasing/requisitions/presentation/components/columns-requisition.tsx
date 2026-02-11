"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from "lucide-react";
import {
  getRequisitionStatusLabel,
  getRequisitionStatusColor,
} from "../../../shared/types/purchasing.types";
import type { Requisition, RequisitionPriority } from "../../domain/entities/requisition.entity";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
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

function getPriorityInfo(priority: RequisitionPriority): { label: string; icon: typeof ArrowUp; color: string } {
  switch (priority) {
    case "urgent":
      return { label: "Urgente", icon: AlertTriangle, color: "text-destructive" };
    case "high":
      return { label: "Alta", icon: ArrowUp, color: "text-warning" };
    case "normal":
      return { label: "Normal", icon: Minus, color: "text-muted-foreground" };
    case "low":
      return { label: "Baja", icon: ArrowDown, color: "text-muted-foreground" };
    default:
      return { label: priority, icon: Minus, color: "text-muted-foreground" };
  }
}

export const columnsRequisitions: ColumnDef<Requisition>[] = [
  {
    accessorKey: "requisition_number",
    header: "Número",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-sm">
        {row.getValue("requisition_number")}
      </span>
    ),
  },
  {
    accessorKey: "requisition_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("requisition_date") as string;
      return (
        <span className="text-sm tabular-nums">
          {formatDate(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "requester",
    header: "Solicitante",
    cell: ({ row }) => {
      const requester = row.original.requester;
      return requester ? (
        <div className="max-w-[150px]">
          <div className="truncate font-medium text-sm">
            {requester.first_name} {requester.last_name}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {requester.email}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Departamento",
    cell: ({ row }) => {
      const department = row.original.department;
      return department ? (
        <span className="text-sm">
          {department.name}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as RequisitionPriority;
      const { label, icon: Icon, color } = getPriorityInfo(priority);
      return (
        <div className={`flex items-center gap-1.5 ${color}`}>
          <Icon className="h-3.5 w-3.5" />
          <span className="text-sm">{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "required_date",
    header: "Fecha Requerida",
    cell: ({ row }) => {
      const date = row.getValue("required_date") as string | null;
      if (!date) return <span className="text-muted-foreground">—</span>;

      const requiredDate = new Date(date);
      const isOverdue = requiredDate < new Date();
      return (
        <span className={`text-sm tabular-nums ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
          {formatDate(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "estimated_total",
    header: "Total Estimado",
    cell: ({ row }) => {
      const total = row.getValue("estimated_total") as number | null;
      return total ? (
        <span className="font-mono text-sm tabular-nums">
          {formatCurrency(total)}
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
      const status = row.getValue("status") as Requisition["status"];
      const label = getRequisitionStatusLabel(status);
      const colorClass = getRequisitionStatusColor(status);
      return (
        <Badge variant="outline" className={`${colorClass} border-0`}>
          {label}
        </Badge>
      );
    },
  },
];
