"use client";

import { Package } from "lucide-react";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useStockLevels } from "../hooks/use-stock-levels";
import { columnsStockLevels } from "./columns-stock-level";

export function StockLevelsTablePage() {
  const {
    data,
    isLoading,
    pagination,
    setPagination,
  } = useStockLevels();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="h-4 w-4" />
          <span className="text-sm">Vista de solo lectura - Los niveles de stock se actualizan automáticamente con los movimientos</span>
        </div>
      </div>

      <Show when={!isLoading} fallback={<TableSkeleton columns={columnsStockLevels.length} />}>
        <MainDataTable
          columns={columnsStockLevels}
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
