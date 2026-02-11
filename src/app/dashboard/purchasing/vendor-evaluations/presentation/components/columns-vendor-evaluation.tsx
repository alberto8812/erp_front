"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getVendorClassificationLabel,
  getVendorClassificationColor,
} from "../../../shared/types/purchasing.types";
import type { VendorEvaluation, EvaluationStatus } from "../../domain/entities/vendor-evaluation.entity";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function getStatusInfo(status: EvaluationStatus): { label: string; color: string } {
  switch (status) {
    case "draft":
      return { label: "Borrador", color: "bg-muted text-muted-foreground" };
    case "submitted":
      return { label: "Enviada", color: "bg-primary/15 text-primary" };
    case "approved":
      return { label: "Aprobada", color: "bg-success/15 text-success" };
    case "rejected":
      return { label: "Rechazada", color: "bg-destructive/15 text-destructive" };
    default:
      return { label: status, color: "bg-muted text-muted-foreground" };
  }
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-primary";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

export const columnsVendorEvaluations: ColumnDef<VendorEvaluation>[] = [
  {
    accessorKey: "evaluation_number",
    header: "Evaluación",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-sm">
        {row.getValue("evaluation_number")}
      </span>
    ),
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
    accessorKey: "evaluation_date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("evaluation_date") as string;
      return (
        <span className="text-sm tabular-nums">
          {formatDate(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "period",
    header: "Período",
    cell: ({ row }) => {
      const start = row.original.period_start;
      const end = row.original.period_end;
      return (
        <div className="text-sm tabular-nums">
          <div className="text-muted-foreground">
            {formatDate(start)} - {formatDate(end)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "overall_score",
    header: "Puntuación",
    cell: ({ row }) => {
      const score = row.getValue("overall_score") as number;
      const colorClass = getScoreColor(score);
      return (
        <div className="flex items-center gap-2 min-w-[100px]">
          <Progress value={score} className="h-2 w-16" />
          <span className={`font-mono text-sm font-medium ${colorClass}`}>
            {score.toFixed(0)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "classification",
    header: "Clasificación",
    cell: ({ row }) => {
      const classification = row.getValue("classification") as VendorEvaluation["classification"];
      const label = getVendorClassificationLabel(classification);
      const colorClass = getVendorClassificationColor(classification);
      return (
        <Badge variant="outline" className={`${colorClass} border-0 font-bold`}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "evaluator",
    header: "Evaluador",
    cell: ({ row }) => {
      const evaluator = row.original.evaluator;
      return evaluator ? (
        <span className="text-sm">
          {evaluator.first_name} {evaluator.last_name}
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
      const status = row.getValue("status") as EvaluationStatus;
      const { label, color } = getStatusInfo(status);
      return (
        <Badge variant="outline" className={`${color} border-0`}>
          {label}
        </Badge>
      );
    },
  },
];
