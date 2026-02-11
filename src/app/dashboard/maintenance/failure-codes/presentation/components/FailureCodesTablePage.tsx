"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { CrudFormDialog } from "@/shared/presentation/components/form-builder/CrudFormDialog";
import { useFailureCodes } from "../hooks/use-failure-codes";
import { columnsFailureCodes } from "./columns-failure-code";
import { failureCodeFormConfig } from "../forms/failure-code-form.config";
import type { FailureCode } from "../../domain/entities/failure-code.entity";
import { PageHeader } from "@/components/dashboard/PageHeader";

export function FailureCodesTablePage() {
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useFailureCodes();
  const [dialogOpen, setDialogOpen] = useState({
    dialogOpen: false,
    importOpen: false,
  });
  const failureCodesHeader = {
    filters: [
      {
        title: "Filtros",
        icon: <Filter className="mr-1.5 h-3.5 w-3.5" />,
        onClick: () => {},
      },
    ],
    import: [
      {
        title: "Crear",
        icon: <Plus className="mr-1.5 h-3.5 w-3.5" />,
        onClick: () => handleCreate(),
      },
    ],
  };
  const [editingItem, setEditingItem] = useState<FailureCode | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setDialogOpen((prev) => ({ ...prev, dialogOpen: true }));
  };

  const handleEdit = (item: FailureCode) => {
    setEditingItem(item);
    setDialogOpen((prev) => ({ ...prev, dialogOpen: true }));
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.failure_code_id, data: formData },
        {
          onSuccess: () =>
            setDialogOpen((prev) => ({ ...prev, dialogOpen: false })),
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () =>
          setDialogOpen((prev) => ({ ...prev, dialogOpen: false })),
      });
    }
  };

  const columnsWithActions = [
    ...columnsFailureCodes,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: FailureCode } }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => handleDelete(row.original.failure_code_id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader pageHeader={failureCodesHeader} />

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsFailureCodes.length} />}
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

      <CrudFormDialog
        open={dialogOpen.dialogOpen}
        onOpenChange={(open) =>
          setDialogOpen((prev) => ({ ...prev, dialogOpen: open }))
        }
        title={editingItem ? "Editar Código" : "Nuevo Código de Falla/Causa"}
        description="Gestione los códigos de fallas, causas y acciones correctivas"
        formConfig={failureCodeFormConfig}
        defaultValues={
          editingItem
            ? (editingItem as unknown as Record<string, unknown>)
            : undefined
        }
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}
