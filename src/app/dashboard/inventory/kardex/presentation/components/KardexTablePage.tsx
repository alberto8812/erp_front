"use client";

import { useRouter } from "next/navigation";
import { FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useKardex } from "../hooks/use-kardex";
import { columnsKardex } from "./columns-kardex";
import type { Kardex } from "../../domain/entities/kardex.entity";

export function KardexTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
  } = useKardex();

  const columnsWithActions = [
    ...columnsKardex,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: Kardex } }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Ver detalle"
            onClick={() => router.push(`/dashboard/inventory/kardex/${row.original.kardex_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="text-sm">
            Registro de movimientos de inventario - Los movimientos se generan desde recepciones, despachos y ajustes
          </span>
        </div>
      </div>

      <Show when={!isLoading} fallback={<TableSkeleton columns={columnsKardex.length} />}>
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
