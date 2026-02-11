"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { CrudFormDialog } from "@/shared/presentation/components/form-builder/CrudFormDialog";
import { useInventoryCounts } from "../hooks/use-inventory-counts";
import { columnsInventoryCounts } from "./columns-inventory-count";
import { inventoryCountFormConfig } from "../forms/inventory-count-form.config";
import type { InventoryCount } from "../../domain/entities/inventory-count.entity";

export function InventoryCountsTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useInventoryCounts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryCount | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: InventoryCount) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.count_id, data: formData },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createMutation.mutate(formData, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const columnsWithActions = [
    ...columnsInventoryCounts,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: InventoryCount } }) => {
        const canEdit = ["planned"].includes(row.original.status);
        const canDelete = row.original.status === "planned";
        const canStart = row.original.status === "planned";

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Ver detalles"
              onClick={() => router.push(`/dashboard/inventory/inventory-counts/${row.original.count_id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {canStart && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-success"
                title="Iniciar conteo"
                onClick={() => router.push(`/dashboard/inventory/inventory-counts/${row.original.count_id}`)}
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(row.original)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDelete(row.original.count_id)}
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
          Nuevo Conteo
        </Button>
      </div>

      <Show when={!isLoading} fallback={<TableSkeleton columns={columnsInventoryCounts.length} />}>
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

      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingItem ? "Editar Conteo" : "Crear Conteo de Inventario"}
        description="Configure los parámetros del conteo. Las líneas se generarán automáticamente."
        formConfig={inventoryCountFormConfig}
        defaultValues={editingItem ? (editingItem as unknown as Record<string, unknown>) : undefined}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}
