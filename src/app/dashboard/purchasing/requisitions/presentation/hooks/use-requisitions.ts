"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/requisition.actions";
import type { Requisition } from "../../domain/entities/requisition.entity";

export function useRequisitions() {
  return usePaginatedModule<Requisition>("requisitions", actions);
}
