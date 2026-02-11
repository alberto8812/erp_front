"use client";

import { Plus, Pencil, Trash2, Eye, PackageCheck, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useShipments } from "../hooks/use-shipments";
import { columnsShipments } from "./columns-shipment";
import type { Shipment } from "../../domain/entities/shipment.entity";
import { useRouter } from "next/navigation";

export function ShipmentsTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useShipments();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNew = () => {
    router.push("/dashboard/sales/shipments/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/sales/shipments/${id}/edit`);
  };

  const columnsWithActions = [
    ...columnsShipments,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: Shipment } }) => {
        const shipment = row.original;
        const canEdit = shipment.status === "draft";
        const canDelete = shipment.status === "draft";
        const canMarkReady = shipment.status === "draft";
        const canShip = shipment.status === "ready";
        const canDeliver = shipment.status === "shipped";

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => router.push(`/dashboard/sales/shipments/${shipment.shipment_id}`)}
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
                onClick={() => handleEdit(shipment.shipment_id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canMarkReady && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary"
                title="Marcar como listo"
              >
                <PackageCheck className="h-4 w-4" />
              </Button>
            )}
            {canShip && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-chart-2"
                title="Marcar como enviado"
              >
                <Truck className="h-4 w-4" />
              </Button>
            )}
            {canDeliver && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Marcar como entregado"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(shipment.shipment_id)}
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
          Nuevo Despacho
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsShipments.length} />}
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
