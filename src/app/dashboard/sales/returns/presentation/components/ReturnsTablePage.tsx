"use client";

import { Plus, Pencil, Trash2, Eye, Send, CheckCircle, XCircle, PackageCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useReturns } from "../hooks/use-returns";
import { columnsReturns } from "./columns-return";
import type { SalesReturn } from "../../domain/entities/return.entity";
import { useRouter } from "next/navigation";

export function ReturnsTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useReturns();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNew = () => {
    router.push("/dashboard/sales/returns/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/sales/returns/${id}/edit`);
  };

  const columnsWithActions = [
    ...columnsReturns,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: SalesReturn } }) => {
        const returnOrder = row.original;
        const canEdit = returnOrder.status === "draft";
        const canDelete = returnOrder.status === "draft";
        const canSubmit = returnOrder.status === "draft";
        const canApprove = returnOrder.status === "pending_approval";
        const canReceive = returnOrder.status === "approved";
        const canProcess = returnOrder.status === "received";

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
                onClick={() => handleEdit(returnOrder.return_id)}
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
            {canReceive && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-chart-2"
                title="Marcar como recibido"
              >
                <PackageCheck className="h-4 w-4" />
              </Button>
            )}
            {canProcess && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Procesar devolución"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(returnOrder.return_id)}
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
          Nueva Devolución
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsReturns.length} />}
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
