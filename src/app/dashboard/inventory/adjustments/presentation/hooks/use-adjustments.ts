"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/adjustment.actions";
import type { Adjustment } from "../../domain/entities/adjustment.entity";

export function useAdjustments() {
  return usePaginatedModule<Adjustment>("adjustments", actions);
}
