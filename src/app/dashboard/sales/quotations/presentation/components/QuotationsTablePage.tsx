"use client";

import { Plus, Pencil, Trash2, Eye, Send, FileCheck, FileX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useQuotations } from "../hooks/use-quotations";
import { columnsQuotations } from "./columns-quotation";
import type { Quotation } from "../../domain/entities/quotation.entity";

export function QuotationsTablePage() {
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useQuotations();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columnsWithActions = [
    ...columnsQuotations,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: Quotation } }) => {
        const quotation = row.original;
        const canEdit = quotation.status === "draft";
        const canDelete = quotation.status === "draft";
        const canSend = quotation.status === "draft";
        const canConvert = quotation.status === "accepted";

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canSend && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary"
                title="Enviar al cliente"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            {canConvert && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Convertir a Orden"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(quotation.quotation_id)}
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div />
        <Button size="sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nueva Cotización
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsQuotations.length} />}
      >
        <MainDataTable
          columns={columnsWithActions}
          data={data?.data}
          pageCount={data?.pageCount}
          rowCount={data?.rowCount}
          isLoading={isLoading}
          onPaginationChange={setPagination}
          paginationState={data?.pageInfo ?? { limit: pagination.limit }}
        />
      </Show>
    </>
  );
}
