"use client";

import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useSalesOrders } from "../hooks/use-sales-orders";
import { columnsSalesOrders } from "./columns-sales-order";
import type { SalesOrder } from "../../domain/entities/sales-order.entity";

export function SalesOrdersTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useSalesOrders();

  const handleCreate = () => {
    router.push("/dashboard/sales/sales-orders/new");
  };

  const handleEdit = (order: SalesOrder) => {
    router.push(`/dashboard/sales/sales-orders/${order.sales_order_id}/edit`);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columnsWithActions = [
    ...columnsSalesOrders,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: SalesOrder } }) => {
        const order = row.original;
        const canEdit = order.status === "draft" || order.status === "pending_approval";
        const canDelete = order.status === "draft";

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => router.push(`/dashboard/sales/sales-orders/${order.sales_order_id}`)}
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
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(order.sales_order_id)}
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
        fallback={<TableSkeleton columns={columnsSalesOrders.length} />}
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
