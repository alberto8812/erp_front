"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Eye,
  ClipboardList,
  PlayCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { CrudFormDialog } from "@/shared/presentation/components/form-builder/CrudFormDialog";
import { useWorkOrders } from "../hooks/use-work-orders";
import { columnsWorkOrder } from "./columns-work-order";
import { workOrderFormConfig } from "../forms/work-order-form.config";
import type { MaintenanceWorkOrder } from "../../domain/entities/work-order.entity";
import { ExcelImportDialog } from "@/components/import/excel-import-dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";

export function WorkOrdersTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useWorkOrders();
  const [dialogOpen, setDialogOpen] = useState({
    dialogOpen: false,
    importOpen: false,
  });
  const [editingItem, setEditingItem] = useState<MaintenanceWorkOrder | null>(
    null,
  );
  const branchesHeader = {
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

  const handleEdit = (item: MaintenanceWorkOrder) => {
    setEditingItem(item);
    setDialogOpen((prev) => ({ ...prev, dialogOpen: true }));
  };

  const handleView = (item: MaintenanceWorkOrder) => {
    router.push(`/dashboard/maintenance/work-orders/${item.work_order_id}`);
  };

  const handleDelete = (item: MaintenanceWorkOrder) => {
    deleteMutation.mutate(item.work_order_id);
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.work_order_id, data: formData },
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

  // Calculate summary stats
  const workOrders = data?.data || [];
  const openCount = workOrders.filter((wo) =>
    ["draft", "pending_approval", "approved", "scheduled"].includes(wo.status),
  ).length;
  const inProgressCount = workOrders.filter(
    (wo) => wo.status === "in_progress",
  ).length;
  const completedCount = workOrders.filter((wo) =>
    ["completed", "pending_review", "closed"].includes(wo.status),
  ).length;
  const overdueCount = workOrders.filter((wo) => {
    if (!wo.scheduled_end_date) return false;
    if (["completed", "closed", "cancelled"].includes(wo.status)) return false;
    return new Date(wo.scheduled_end_date) < new Date();
  }).length;

  const columnsWithActions = [
    ...columnsWorkOrder,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: MaintenanceWorkOrder } }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleView(row.original)}
            title="Ver detalle"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleEdit(row.original)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => handleDelete(row.original)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader pageHeader={branchesHeader} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <ClipboardList className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Abiertas
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{openCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-chart-4 mb-1">
            <PlayCircle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              En Progreso
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {inProgressCount}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-success mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Completadas
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {completedCount}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Vencidas
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{overdueCount}</p>
        </div>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsWorkOrder.length} />}
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
        title={
          editingItem ? "Editar Orden de Trabajo" : "Nueva Orden de Trabajo"
        }
        description="Complete los datos de la orden de trabajo"
        formConfig={workOrderFormConfig}
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
        moduleKey="work-orders"
        title="Importar  Ordenes de Trabajo desde Excel"
        onSuccess={() => {}}
      />
    </>
  );
}
