"use client";

import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { usePurchaseOrders } from "../hooks/use-purchase-orders";
import { columnsPurchaseOrders } from "./columns-purchase-order";
import type { PurchaseOrder } from "../../domain/entities/purchase-order.entity";

export function PurchaseOrdersTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = usePurchaseOrders();

  const handleCreate = () => {
    router.push("/dashboard/purchasing/purchase-orders/new");
  };

  const handleEdit = (order: PurchaseOrder) => {
    router.push(`/dashboard/purchasing/purchase-orders/${order.purchase_order_id}/edit`);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columnsWithActions = [
    ...columnsPurchaseOrders,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: PurchaseOrder } }) => {
        const order = row.original;
        const canEdit = order.status === "draft" || order.status === "pending_approval";
        const canDelete = order.status === "draft";
        const canSend = order.status === "approved";

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
                onClick={() => handleEdit(order)}
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
                title="Enviar al proveedor"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(order.purchase_order_id)}
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
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nueva Orden
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsPurchaseOrders.length} />}
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
