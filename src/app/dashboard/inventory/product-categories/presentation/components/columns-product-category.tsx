"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ProductCategory } from "../../domain/entities/product-category.entity";

export const columnsProductCategories: ColumnDef<ProductCategory>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => <span className="font-medium">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "level",
    header: "Nivel",
    cell: ({ row }) => {
      const level = row.getValue("level") as number;
      return (
        <Badge variant="outline" className="font-mono">
          {level}
        </Badge>
      );
    },
  },
  {
    accessorKey: "path",
    header: "Ruta",
    cell: ({ row }) => {
      const path = row.getValue("path") as string | null;
      return path ? (
        <span className="text-xs text-muted-foreground">{path}</span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const active = row.getValue("is_active") as boolean;
      return (
        <Badge variant={active ? "success" : "destructive"}>
          {active ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
];
