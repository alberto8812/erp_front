"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import * as actions from "../../application/use-cases/stock-level.actions";
import type { StockLevel } from "../../domain/entities/stock-level.entity";
import type { PaginatedResponse } from "@/shared/domain/base/base-entity.types";

interface CursorPaginationState {
  limit: number;
  startCursor?: string | null;
  endCursor?: string | null;
}

export function useStockLevels() {
  const [pagination, setPagination] = useState<CursorPaginationState>({
    limit: 10,
    startCursor: null,
    endCursor: null,
  });

  const { data, isLoading } = useQuery<PaginatedResponse<StockLevel>>({
    queryKey: ["stock-levels", pagination],
    queryFn: () =>
      actions.findAllPaginated({
        limit: pagination.limit,
        afterCursor: pagination.startCursor,
        beforeCursor: pagination.endCursor,
      }),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    isLoading,
    pagination,
    setPagination,
  };
}
