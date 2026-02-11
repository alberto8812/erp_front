"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Eye,
  Calendar,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useToast } from "@/components/hooks/use-toast";
import { usePlans } from "../hooks/use-plans";
import { columnsMaintenancePlans } from "./columns-plan";
import * as planActions from "../../application/use-cases/maintenance-plan.actions";
import type { MaintenancePlan } from "../../domain/entities/maintenance-plan.entity";
import { ExcelImportDialog } from "@/components/import/excel-import-dialog";
import Page from "@/app/dashboard/admin/audit-logs/page";
import { PageHeader } from "@/components/dashboard/PageHeader";

export function PlansTablePage() {
  const [dialogOpen, setDialogOpen] = useState({
    dialogOpen: false,
    importOpen: false,
  });
  const plansHeader = {
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, pagination, setPagination, deleteMutation } =
    usePlans();

  const activateMutation = useMutation({
    mutationFn: planActions.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-plans"] });
      toast({
        title: "Plan activado",
        description: "El plan se ha activado correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: planActions.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-plans"] });
      toast({
        title: "Plan desactivado",
        description: "El plan se ha desactivado correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    router.push("/dashboard/maintenance/plans/new");
  };

  const handleEdit = (item: MaintenancePlan) => {
    router.push(`/dashboard/maintenance/plans/${item.plan_id}/edit`);
  };

  const handleView = (item: MaintenancePlan) => {
    router.push(`/dashboard/maintenance/plans/${item.plan_id}`);
  };

  const handleDelete = (item: MaintenancePlan) => {
    deleteMutation.mutate(item.plan_id);
  };

  const handleToggleStatus = (item: MaintenancePlan) => {
    if (item.is_active) {
      deactivateMutation.mutate(item.plan_id);
    } else {
      activateMutation.mutate(item.plan_id);
    }
  };

  // Calculate summary stats
  const plans = data?.data || [];
  const activePlans = plans.filter((p) => p.is_active).length;
  const criticalPlans = plans.filter(
    (p) => p.priority === "critical" || p.priority === "high",
  ).length;
  const dueSoonPlans = plans.filter((p) => {
    if (!p.next_due_date) return false;
    const daysUntil = Math.ceil(
      (new Date(p.next_due_date).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    );
    return daysUntil >= 0 && daysUntil <= 7;
  }).length;
  const overduePlans = plans.filter((p) => {
    if (!p.next_due_date) return false;
    return new Date(p.next_due_date) < new Date();
  }).length;

  const columnsWithActions = [
    ...columnsMaintenancePlans,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: MaintenancePlan } }) => (
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
            onClick={() => handleToggleStatus(row.original)}
            title={row.original.is_active ? "Desactivar" : "Activar"}
          >
            {row.original.is_active ? (
              <PauseCircle className="h-4 w-4 text-warning" />
            ) : (
              <PlayCircle className="h-4 w-4 text-success" />
            )}
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
      <PageHeader pageHeader={plansHeader} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Total Planes
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {data?.rowCount || 0}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-success mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Activos
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{activePlans}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-warning mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Próximos 7 días
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{dueSoonPlans}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Vencidos
            </span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{overduePlans}</p>
        </div>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsMaintenancePlans.length} />}
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

      <ExcelImportDialog
        open={dialogOpen.importOpen}
        onOpenChange={(open) =>
          setDialogOpen((prev) => ({ ...prev, importOpen: open }))
        }
        moduleKey="maintenance_plans"
        title="Importar  Planes de Mantenimiento desde Excel"
        onSuccess={() => {}}
      />
    </>
  );
}
