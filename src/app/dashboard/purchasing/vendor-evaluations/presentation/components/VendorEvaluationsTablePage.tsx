"use client";

import { Plus, Pencil, Trash2, Eye, Send, CheckCircle, XCircle, Calculator, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useVendorEvaluations } from "../hooks/use-vendor-evaluations";
import { columnsVendorEvaluations } from "./columns-vendor-evaluation";
import type { VendorEvaluation } from "../../domain/entities/vendor-evaluation.entity";
import { useRouter } from "next/navigation";

export function VendorEvaluationsTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useVendorEvaluations();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNew = () => {
    router.push("/dashboard/purchasing/vendor-evaluations/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/purchasing/vendor-evaluations/${id}/edit`);
  };

  const columnsWithActions = [
    ...columnsVendorEvaluations,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: VendorEvaluation } }) => {
        const evaluation = row.original;
        const canEdit = evaluation.status === "draft";
        const canDelete = evaluation.status === "draft";
        const canSubmit = evaluation.status === "draft";
        const canApprove = evaluation.status === "submitted";
        const canCalculate = evaluation.status === "draft";

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
                title="Editar"
                onClick={() => handleEdit(evaluation.evaluation_id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canCalculate && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-chart-2"
                title="Calcular puntuación"
              >
                <Calculator className="h-4 w-4" />
              </Button>
            )}
            {canSubmit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary"
                title="Enviar para aprobación"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            {canApprove && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-success"
                  title="Aprobar"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  title="Rechazar"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Ver historial del proveedor"
            >
              <History className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(evaluation.evaluation_id)}
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
          Nueva Evaluación
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsVendorEvaluations.length} />}
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
