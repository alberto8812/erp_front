"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Filter, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleDataTable } from "@/shared/presentation/components/SimpleDataTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { CrudFormDialog } from "@/shared/presentation/components/form-builder/CrudFormDialog";
import { useStateDeparments } from "../hooks/use-state-deparments";
import { columnsStateDeparments } from "./columns-state-deparment";
import { stateDeparmentFormConfig } from "../forms/state-deparment-form.config";
import type { StateDeparment } from "../../domain/entities/state-deparment.entity";
import { ExcelImportDialog } from "@/components/import/excel-import-dialog";
import Page from "@/app/dashboard/admin/audit-logs/page";
import { PageHeader } from "@/components/dashboard/PageHeader";

export function StateDepartmentsTablePage() {
  const { data, isLoading, createMutation, updateMutation, deleteMutation } =
    useStateDeparments();
  const [dialogOpen, setDialogOpen] = useState({
    dialogOpen: false,
    importOpen: false,
  });
  const [editingItem, setEditingItem] = useState<StateDeparment | null>(null);

  const regionZoneHeader = {
    filters: [
      {
        title: "Filtros",
        icon: <Filter className="mr-1.5 h-3.5 w-3.5" />,
        onClick: () => {},
      },
    ],
    import: [
      {
        title: "Importar Excel",
        icon: <Upload className="mr-1.5 h-3.5 w-3.5" />,
        onClick: () => setDialogOpen((prev) => ({ ...prev, importOpen: true })),
      },
      {
        title: "Crear",
        icon: <Plus className="mr-1.5 h-3.5 w-3.5" />,
        onClick: () => handleCreate(),
      },
    ],
  };

  const handleCreate = () => {
    setEditingItem(null);
    setDialogOpen((prev) => ({ ...prev, dialogOpen: true }));
  };

  const handleEdit = (item: StateDeparment) => {
    setEditingItem(item);
    setDialogOpen((prev) => ({ ...prev, dialogOpen: true }));
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: formData },
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
    ...columnsStateDeparments,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: StateDeparment } }) => (
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
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader pageHeader={regionZoneHeader} />

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsStateDeparments.length} />}
      >
        <SimpleDataTable
          columns={columnsWithActions}
          data={data}
          isLoading={isLoading}
        />
      </Show>

      <CrudFormDialog
        open={dialogOpen.dialogOpen}
        onOpenChange={(open) =>
          setDialogOpen((prev) => ({ ...prev, dialogOpen: open }))
        }
        title={editingItem ? "Editar Departamento" : "Crear Departamento"}
        formConfig={stateDeparmentFormConfig}
        defaultValues={
          editingItem
            ? (editingItem as unknown as Record<string, unknown>)
            : undefined
        }
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ExcelImportDialog
        open={dialogOpen.importOpen}
        onOpenChange={(open) =>
          setDialogOpen((prev) => ({ ...prev, importOpen: open }))
        }
        moduleKey="state_deparments"
        title="Importar Departamentos/Estados desde Excel"
        onSuccess={() => {}}
        rute="department"
      />
    </>
  );
}
