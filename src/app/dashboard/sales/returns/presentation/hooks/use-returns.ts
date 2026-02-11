"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/return.actions";
import type { SalesReturn } from "../../domain/entities/return.entity";

export function useReturns() {
  return usePaginatedModule<SalesReturn>("returns", actions);
}
