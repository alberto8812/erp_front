"use client";

import { Plus, Pencil, Trash2, Eye, Send, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useRequisitions } from "../hooks/use-requisitions";
import { columnsRequisitions } from "./columns-requisition";
import type { Requisition } from "../../domain/entities/requisition.entity";
import { useRouter } from "next/navigation";

export function RequisitionsTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useRequisitions();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNew = () => {
    router.push("/dashboard/purchasing/requisitions/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/purchasing/requisitions/${id}/edit`);
  };

  const columnsWithActions = [
    ...columnsRequisitions,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: Requisition } }) => {
        const requisition = row.original;
        const canEdit = requisition.status === "draft";
        const canDelete = requisition.status === "draft";
        const canSubmit = requisition.status === "draft";
        const canApprove = requisition.status === "pending_approval";
        const canConvert = requisition.status === "approved";

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
                onClick={() => handleEdit(requisition.requisition_id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canSubmit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary"
                title="Enviar para aprobación"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            {canApprove && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-success"
                  title="Aprobar"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  title="Rechazar"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            {canConvert && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Convertir a Orden de Compra"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(requisition.requisition_id)}
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
        <Button size="sm" onClick={handleNew}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nueva Requisición
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsRequisitions.length} />}
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
