"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { KARDEX_MOVEMENT_TYPE_OPTIONS } from "@/app/dashboard/inventory/shared/types/inventory.types";
import type { MovementReason } from "../../domain/entities/movement-reason.entity";

export const columnsMovementReasons: ColumnDef<MovementReason>[] = [
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
    accessorKey: "movement_types",
    header: "Tipos de Movimiento",
    cell: ({ row }) => {
      const types = row.getValue("movement_types") as string[];
      if (!types || types.length === 0) {
        return <span className="text-muted-foreground">—</span>;
      }
      const displayTypes = types.slice(0, 2);
      const remaining = types.length - 2;
      return (
        <div className="flex flex-wrap gap-1">
          {displayTypes.map((type) => {
            const option = KARDEX_MOVEMENT_TYPE_OPTIONS.find((o) => o.value === type);
            return (
              <Badge key={type} variant="outline" className="text-xs">
                {option?.label || type}
              </Badge>
            );
          })}
          {remaining > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{remaining}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "requires_approval",
    header: "Aprobación",
    cell: ({ row }) => {
      const requires = row.getValue("requires_approval") as boolean;
      return (
        <Badge variant={requires ? "destructive" : "secondary"}>
          {requires ? "Requerida" : "No"}
        </Badge>
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
