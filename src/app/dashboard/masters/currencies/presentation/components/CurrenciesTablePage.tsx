"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Filter, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { CrudFormDialog } from "@/shared/presentation/components/form-builder/CrudFormDialog";
import { useCurrencies } from "../hooks/use-currencys";
import { columnsCurrencies } from "./columns-currency";
import { currencyFormConfig } from "../forms/currency-form.config";
import type { Currency } from "../../domain/entities/currency.entity";
import { ExcelImportDialog } from "@/components/import/excel-import-dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";

export function CurrenciesTablePage() {
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useCurrencies();
  const [dialogOpen, setDialogOpen] = useState({
    dialogOpen: false,
    importOpen: false,
  });
  const [editingItem, setEditingItem] = useState<Currency | null>(null);
  const currenciesHeader = {
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

  const handleEdit = (item: Currency) => {
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
    ...columnsCurrencies,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: Currency } }) => (
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
      <PageHeader pageHeader={currenciesHeader} />

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsCurrencies.length} />}
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
        title={editingItem ? "Editar Moneda" : "Crear Moneda"}
        formConfig={currencyFormConfig}
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
        moduleKey="currencies"
        title="Importar Monedas desde Excel"
        onSuccess={() => {}}
      />
    </>
  );
}
