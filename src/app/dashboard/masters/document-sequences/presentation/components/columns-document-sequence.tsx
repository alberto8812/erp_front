"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { DocumentSequence } from "../../domain/entities/document-sequence.entity";

export const columnsDocumentSequences: ColumnDef<DocumentSequence>[] = [
  {
    accessorKey: "sequence_code",
    header: "Código",
    cell: ({ row }) => <span className="font-medium">{row.getValue("sequence_code")}</span>,
  },
  {
    accessorKey: "sequence_name",
    header: "Nombre",
  },
  {
    accessorKey: "prefix",
    header: "Prefijo",
  },
  {
    accessorKey: "current_number",
    header: "Número Actual",
    cell: ({ row }) => <span className="tabular-nums">{row.getValue("current_number")}</span>,
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
