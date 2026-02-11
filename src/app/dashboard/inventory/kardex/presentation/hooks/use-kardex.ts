"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import * as actions from "../../application/use-cases/kardex.actions";
import type { Kardex } from "../../domain/entities/kardex.entity";
import type { PaginatedResponse } from "@/shared/domain/base/base-entity.types";

interface CursorPaginationState {
  limit: number;
  startCursor?: string | null;
  endCursor?: string | null;
}

export function useKardex() {
  const [pagination, setPagination] = useState<CursorPaginationState>({
    limit: 20,
    startCursor: null,
    endCursor: null,
  });

  const { data, isLoading } = useQuery<PaginatedResponse<Kardex>>({
    queryKey: ["kardex", pagination],
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
