"use client";

import { Plus, Pencil, Trash2, Eye, ClipboardCheck, CheckCircle, XCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useReceipts } from "../hooks/use-receipts";
import { columnsReceipts } from "./columns-receipt";
import type { Receipt } from "../../domain/entities/receipt.entity";
import { useRouter } from "next/navigation";

export function ReceiptsTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useReceipts();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNew = () => {
    router.push("/dashboard/purchasing/receipts/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/purchasing/receipts/${id}/edit`);
  };

  const columnsWithActions = [
    ...columnsReceipts,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: Receipt } }) => {
        const receipt = row.original;
        const canEdit = receipt.status === "draft";
        const canDelete = receipt.status === "draft";
        const canStartInspection = receipt.status === "draft" && receipt.requires_inspection;
        const canCompleteInspection = receipt.status === "pending_inspection";
        const canConfirm = receipt.status === "inspected" || (receipt.status === "draft" && !receipt.requires_inspection);

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
                onClick={() => handleEdit(receipt.receipt_id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canStartInspection && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary"
                title="Iniciar inspección"
              >
                <ClipboardCheck className="h-4 w-4" />
              </Button>
            )}
            {canCompleteInspection && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-chart-2"
                title="Completar inspección"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {canConfirm && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Confirmar recepción"
              >
                <Package className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(receipt.receipt_id)}
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
          Nueva Recepción
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsReceipts.length} />}
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
