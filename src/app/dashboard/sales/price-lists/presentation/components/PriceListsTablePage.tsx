"use client";

import { Plus, Pencil, Trash2, Eye, Power, PowerOff, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { usePriceLists } from "../hooks/use-price-lists";
import { columnsPriceLists } from "./columns-price-list";
import type { PriceList } from "../../domain/entities/price-list.entity";
import { useRouter } from "next/navigation";

export function PriceListsTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = usePriceLists();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNew = () => {
    router.push("/dashboard/sales/price-lists/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/sales/price-lists/${id}/edit`);
  };

  const columnsWithActions = [
    ...columnsPriceLists,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: PriceList } }) => {
        const priceList = row.original;
        const canSetDefault = !priceList.is_default && priceList.is_active;

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
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Editar"
              onClick={() => handleEdit(priceList.price_list_id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Duplicar"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {canSetDefault && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-warning"
                title="Establecer como predeterminada"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
            {priceList.is_active ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                title="Desactivar"
              >
                <PowerOff className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Activar"
              >
                <Power className="h-4 w-4" />
              </Button>
            )}
            {!priceList.is_default && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(priceList.price_list_id)}
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
          Nueva Lista de Precios
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsPriceLists.length} />}
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
