"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { FailureCode, FailureCodeType } from "../../domain/entities/failure-code.entity";

const TYPE_LABELS: Record<FailureCodeType, string> = {
  failure: "Falla",
  cause: "Causa",
  action: "Acción",
};

const TYPE_COLORS: Record<FailureCodeType, string> = {
  failure: "bg-destructive/15 text-destructive",
  cause: "bg-warning/15 text-warning",
  action: "bg-success/15 text-success",
};

export const columnsFailureCodes: ColumnDef<FailureCode>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "code_type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("code_type") as FailureCodeType;
      return (
        <Badge className={TYPE_COLORS[type]}>
          {TYPE_LABELS[type] || type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => {
      const category = row.getValue("category") as string | null;
      return category ? (
        <Badge variant="outline">{category}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return description ? (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
          {description}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "usage_count",
    header: "Uso",
    cell: ({ row }) => {
      const count = row.getValue("usage_count") as number | null;
      return (
        <span className="font-mono text-sm">{count ?? 0}</span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
];
